import prisma from "@lib/prismaClient";

export function check(userApiKey: string, fileSize: number) {
    prisma.users.findFirst()
    return true
}