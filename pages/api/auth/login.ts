import passport from 'passport'
import nextConnect from 'next-connect'
import { localStrategy } from '@lib/passport-local'
import { setLoginSession } from '@lib/auth'

const authenticate = (method: any, req: any, res: any) =>
    new Promise((resolve, reject) => {
        passport.authenticate(method, { session: false }, (error, token) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })(req, res)
    })

passport.use(localStrategy)

export default nextConnect()
    .use(passport.initialize())
    .post(async (req, res) => {
        try {
            const user: any = await authenticate('local', req, res)
            // session is the payload to save in the token, it may contain basic info about the user
            const session = { ...user }

            await setLoginSession(res, session)
            //@ts-ignore
            return res.status(200).send({ done: true })
        } catch (error) {
            console.error(error)
            //@ts-ignore
            return res.status(401).send(error.message)
        }
    })
