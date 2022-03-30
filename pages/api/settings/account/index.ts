import { getLoginSession } from '@lib/auth'
import { findUser } from '@lib/user'
import prisma from '@lib/prismaClient'
export default async function user(req: any, res: any) {
    try {
        const session = await getLoginSession(req)
        const user = (session && (await findUser(session))) ?? null

        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).end('Authentication token is invalid, please log in')
    }
}
