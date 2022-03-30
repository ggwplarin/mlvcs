import { getLoginSession } from '@lib/auth'
import { findUser } from '@lib/user'
import prisma from '@lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
import rollKey from '@lib/auth/rollKey'
export default async function user(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const oldKey = req.query['key'] as string
        const user = await prisma.users.findUnique({ where: { key: oldKey } })
        const newKey = rollKey()
        if (user) {
            const _ = await prisma.users.update({ where: { id: user.id }, data: { key: newKey } })
        }
        return res.status(200).json("ok")
    }
}
