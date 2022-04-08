import { getLoginSession } from '@lib/auth'
import { findUser } from '@lib/user'
import prisma from '@lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import AWS from 'aws-sdk'
export default async function repo(req: NextApiRequest,
    res: NextApiResponse) {
    const { folder, file } = req.query
    const s3 = new AWS.S3({
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        endpoint: process.env.S3_ENDPOINT
    })
    const key = `${folder}/${file}`
    const fileStream = s3.getObject({ Bucket: "ggwp-storage", Key: key }).createReadStream()
    fileStream.pipe(res)
}
