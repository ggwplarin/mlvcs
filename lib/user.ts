import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@lib/prismaClient'
import rollKey from '@lib/auth/rollKey'

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

//const users = []

export interface user {
    id: string
    username: string
    hash: string
    salt: string
    createdAt?: Date
    balance?: number
    storageSize?: number
    usedStorage?: number
    apiKeys: apiKey[]
    invoices: invoice[]
    own: repo[]
    collaborate: repo[]
}

export interface repo {

}
export interface invoice {

}
export interface apiKey {

}

export async function createUser({ username, password }: { username: string, password: string }) {
    // Here you should create the user and save the salt and hashed password (some dbs may have
    // authentication methods that will do it for you so you don't have to worry about it):
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex')
    // This is an in memory store for users, there is no data persistence without a proper DB
    //users.push(user)
    const key = rollKey()
    const user = await prisma.users.create({
        data: {
            username: username,
            hash: hash,
            salt: salt,
            key: key
        }
    })
    console.log(`User ${user} created`)
    return { username, createdAt: Date.now() }
}

// Here you should lookup for the user in your DB
export async function findUser({ username }: { username: string }) {
    // This is an in memory store for users, there is no data persistence without a proper DB
    const user = await prisma.users.findFirst({
        where: {
            username: { equals: username }
        },
    })
    return user
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export function validatePassword({ user, password }: { user: any, password: string }) {
    const inputHash = crypto
        .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
        .toString('hex')
    const passwordsMatch = user.hash === inputHash
    return passwordsMatch
}
