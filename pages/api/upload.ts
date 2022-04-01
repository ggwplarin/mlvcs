import type { NextApiRequest, NextApiResponse } from 'next'
import Busboy from 'busboy'
import AWS from 'aws-sdk'
import pako, { InflateOptions } from 'pako'
import { IncomingHttpHeaders } from 'http'
// import { upload } from '@libs/S3Uploader'
import prisma from '@lib/prismaClient'
import { v4 as uuidv4 } from 'uuid'
import { Readable, PassThrough } from 'stream'
import * as StreamPromises from "stream/promises";
import semver from 'semver'
import { Users } from '@prisma/client'
export const config = {
    api: {
        bodyParser: false,
    }
}
interface BBField {
    [key: string]: string
}
function getS3() {
    const s3 = new AWS.S3({
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        endpoint: process.env.S3_ENDPOINT
    })
    return s3
}
export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    if (request.method != "POST") return response.status(405).send(JSON.stringify({ error: "Method not Allowed" }))
    if (!request.headers.key) return response.status(401).send(JSON.stringify({ error: "No api key provided" }))
    if (request.headers['content-type']?.includes('multipart/form-data') && request.query['type'] == 'model') {
        console.log("Uploading model")
        const user = await prisma.users.findFirst({ where: { key: { equals: request.headers.key as string } } })
        if (!user) return response.status(401).json({ error: "Wrong key" })
        const repoCreator = await prisma.users.findFirst({ where: { username: { equals: request.query['creator'] as string } } })
        console.log(repoCreator)
        const creator = repoCreator || user
        const repo = await prisma.repos.findFirst({
            where: { creatorId: creator.id, name: { equals: request.query['name'] as string } },
            include: { creator: true, contributors: true, owners: true, editors: true }
        })
        console.log(repo)
        if (repo && !(repo?.creatorId == user.id || repo?.owners.includes(user!) || repo?.contributors.includes(user!) || repo?.owners.includes(user!))) {
            console.log("Access not allowed for this user")
            return response.status(403).json({ error: "Access not allowed for this user" })
        }
        const compressed = false
        const s3UploadParams = {}


        const bb = Busboy({ headers: request.headers });
        const fileUploadPromise = [];
        const bucket = "mlvcs-models"
        const s3 = getS3();
        const status: { error?: boolean, results: { uploadedFiles: { id: string, filename: string, size: number }[] } } = { results: { uploadedFiles: [] } }
        bb.on('file', (name, file, info) => {
            const uuid = uuidv4()
            const { filename, encoding, mimeType } = info;
            console.log(
                `File [${name}]: filename: ${filename}, encoding:${encoding}, mimeType: ${mimeType}`,
            );
            const uploader = (key: any) => {
                const passToS3 = new PassThrough();
                const fileReadStream = new Readable({
                    read(size) {
                        if (!size) this.push(null);
                        //@ts-ignore
                        else this.push();
                    },
                });
                const inflate = new pako.Inflate({ level: 0 } as InflateOptions);
                inflate.onData = (dat) => {
                    fileReadStream.push(dat);
                };
                inflate.onEnd = () => {
                    fileReadStream.push(null);
                };
                fileUploadPromise.push(new Promise((res, rej) => {
                    s3.upload({
                        Bucket: bucket,
                        Key: key,
                        Body: passToS3,
                        ...s3UploadParams,
                    }, (err: any, data: any) => {
                        if (err) {
                            rej(err);
                        } else {
                            res({ ...data, originalname: filename, mimeType });
                        }
                    });
                }));
                let nextChunk: any = null;
                file.on('data', (data) => {
                    console.log(`File [${name}] got ${data.length} bytes`);
                    if (mimeType == 'application/octet-stream') {
                        console.log(`Start uploading chunk: ${filename}`)
                        const contentLength = data.length;
                        if (!compressed && nextChunk) {
                            fileReadStream.push(Buffer.from(nextChunk));
                        } else if (compressed && nextChunk) {
                            inflate.push(nextChunk, false);
                        }
                        nextChunk = data;
                        fileReadStream.pipe(passToS3);
                        status.results.uploadedFiles.push({ id: uuid, filename: filename, size: contentLength });;
                    }
                    if (mimeType == 'application/json') {
                        console.log("JSON")
                        let json: { version?: string } = {}
                        try {
                            json = JSON.parse(data.toString());
                            console.log(json)
                            if (json.version) {
                                semver.valid(json.version)

                            }
                            return
                        }
                        catch {
                            console.error(data.toString())
                            return
                        }

                    }
                    else {

                    }
                })
                file.on('close', () => {
                    console.log(`File [${name}] done`);

                });
                file.on('end', () => {
                    if (!compressed) {
                        fileReadStream.push(Buffer.from(nextChunk));
                        fileReadStream.push(null);
                    } else {
                        inflate.push(nextChunk, true);
                    }
                });
            }
            uploader(uuid)
        });
        bb.on('field', (name, val, info) => {
            console.log(`Field [${name}]: value: ${val}`);
            try {
                const json = JSON.parse(val);
            } catch (error: any) {
                console.error(error.toString());
                console.error("Hmm, uploaded json looks like a bad JSON")
                response.status(500).end(JSON.stringify("Hmm, uploaded json looks like a bad JSON"))
            }
        });
        bb.on('error', () => {
            status.error = true;
        })
        bb.on('finish', () => {
            console.log('Done parsing form!');
            // response.writeHead(303, { Connection: 'close', Location: '/' });

        });
        request.pipe(bb)
        await StreamPromises.finished(bb)
        console.log(status)
        if (status.error) return response.status(500).json({ error: "Error parsing form" })
        if (status.results.uploadedFiles?.length == 0) return response.status(500).json({ error: "Zero files uploaded" })
        // if (status.results.uploadedFiles!.length > 1) return response.status(500).json({ error: "One file per upload request is current limit" })
        if (!repo) {
            const newRepo = await prisma.repos.create({
                data: {
                    name: request.query['name'] as string,
                    //@ts-ignore
                    creatorId: user.id,
                    modelsVersions: {
                        create:
                            [
                                {
                                    //@ts-ignore
                                    fileName: status.results.uploadedFiles!.at(0)!.id,
                                    //@ts-ignore
                                    originalFilename: status.results.uploadedFiles!.at(0)!.filename,
                                    //@ts-ignore
                                    size: 0
                                }
                            ]
                    }
                }, include: { creator: true, contributors: true, owners: true, editors: true }
            })
        }




        return response.status(200).end(JSON.stringify("uploaded"))

    }
    else {
        response.status(400).send(JSON.stringify({ error: "bruh" }))
    }
} 
