import prisma from '@lib/prismaClient'
import type { NextApiRequest, NextApiResponse } from 'next'

type SearchResult = {
    id?: number
    user?: string
    repo?: string
    type?: string
    wiki?: string
}

async function searchRepositories(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = []
    const repos = await prisma.repos.findMany({
        where: {
            name: {
                contains: query
            }
        }, include: { creator: true }
    })
    repos.forEach((repo: any) => results.push({ repo: repo.name, user: repo.creator.username, type: "REPO" }))
    results.forEach((r) => r.type = "REPO")
    console.log(`repos search results`)
    console.log(results)
    return results
}

async function searchUsers(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = []
    const users = await prisma.users.findMany({
        where: {
            username: {
                contains: query
            }
        }
    })
    users.forEach((user: any) => results.push({ user: user.username, type: "USER" }))
    console.log(`users search results`)
    console.log(results)
    return results
}

async function searchHelp(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = []
    results.forEach((r) => r.type = "DOCS")
    console.log(`docs search results`)
    console.log(results)
    return results
}

async function search(query: string): Promise<SearchResult[]> {
    let results = await searchRepositories(query)
    if (results.length >= 8) return results.slice(0, 8)
    results = results.concat(await searchUsers(query))
    if (results.length >= 8) return results.slice(0, 8)
    results = results.concat(await searchHelp(query))
    return results.slice(0, 8)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { q } = req.query
    const results: SearchResult[] = await search(q as string)
    results.forEach((r, index) => r.id = index)
    console.log(`indexed search results`)
    console.log(results)
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.send(JSON.stringify({ results: results }))
}