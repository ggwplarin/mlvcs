import { getLoginSession } from '@lib/auth'
import { findUser } from '@lib/user'
import prisma from '@lib/prismaClient'
import { NextApiRequest, NextApiResponse } from 'next'
export default async function repo(req: NextApiRequest,
    res: NextApiResponse) {
    const user = await prisma.users.findFirst({
        where: {
            key: {
                equals: req.query['key'] as string,
            }
        }
    })

    const name = req.query.repo as string
    const creator = req.query.user as string
    const repo = await prisma.repos.findFirst(
        {
            where: {
                name: {
                    equals: name
                },
                creator: {
                    username: {
                        equals: creator
                    }
                }
            },
            include: { creator: true, contributors: true, owners: true, editors: true, modelsVersions: true }
        }
    )
    if (repo?.access == 'public') {
        return res.status(200).json({ repo })
    }
    else {
        if (user && (repo?.creator == user || repo?.owners.includes(user!) || repo?.contributors.includes(user!) || repo?.owners.includes(user!))) {
            return res.status(200).json({ repo })
        }
        else {
            return res.status(401).json("")
        }
    }


}
