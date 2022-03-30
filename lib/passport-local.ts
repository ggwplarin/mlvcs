import { Users } from '@prisma/client'
import Local from 'passport-local'
import { findUser, validatePassword } from './user'

export const localStrategy = new Local.Strategy(function (
    username: any,
    password: any,
    done: (arg0: Error | null, arg1?: Users | undefined) => void
) {
    findUser({ username })
        .then((user) => {
            if (user && validatePassword({ user, password })) {
                done(null, user)
            } else {
                done(new Error('Invalid username and password combination'))
            }
        })
        .catch((error) => {
            done(error)
        })
})
