import { createUser, findUser } from '@lib/user'

export default async function signup(req: any, res: any) {
    try {
        if (await findUser(req.body)) return res.status(500).end("User already exists")
        await createUser(req.body)
        return res.status(200).send({ done: true })
    } catch (error: any) {
        console.error(error)
        return res.status(500).end(error.message)
    }
}
