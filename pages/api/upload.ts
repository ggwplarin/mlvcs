import type { NextApiRequest, NextApiResponse } from 'next'
import Busboy from 'busboy'
import AWS from 'aws-sdk'
import pako, { InflateOptions } from 'pako'
import { IncomingHttpHeaders } from 'http'
// import { upload } from '@libs/S3Uploader'
import prisma from '@lib/prismaClient'
import { v4 as uuidv4 } from 'uuid'
import { Readable, PassThrough } from 'stream'
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
    if (!request.query['apiKey']) return response.status(401).send(JSON.stringify({ error: "No api key provided" }))
    if (request.headers['content-type']?.includes('multipart/form-data') && request.query['type'] == 'model') {
        console.log("Uploading model")
        const user = await prisma.users.findUnique({ where: { key: request.query['key'] as string } })
        const compressed = false
        const s3UploadParams = {}
        const repo = request.query['repo'] as string
        const uuid = uuidv4()
        const bb = Busboy({ headers: request.headers });
        const fileUploadPromise = [];
        const bucket = "mlvcs-models"
        const s3 = getS3();
        bb.on('file', (name, file, info) => {
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
                const inflate = new pako.Inflate({ level: 1 } as InflateOptions);
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
                        console.log(`Start uploading file: ${filename}`)
                        const contentLength = data.length;
                        if (!compressed && nextChunk) {
                            fileReadStream.push(Buffer.from(nextChunk));
                        } else if (compressed && nextChunk) {
                            inflate.push(nextChunk, false);
                        }
                        nextChunk = data;
                        fileReadStream.pipe(passToS3);
                    }
                    if (mimeType == 'application/json') {
                        console.log("JSON")
                        let json = {}
                        try {
                            json = JSON.parse(data.toString());
                            console.log(json)
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
        bb.on('close', () => {
            console.log('Done parsing form!');
            // response.writeHead(303, { Connection: 'close', Location: '/' });
            response.status(200).end(JSON.stringify("uploaded"))
        });
        request.pipe(bb)

    }
    else {
        response.status(400).send(JSON.stringify({ error: "bruh" }))
    }
} 
