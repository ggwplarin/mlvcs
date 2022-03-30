import passport from "passport";
import { Strategy } from "passport-http-bearer"
import prisma from '@lib/prismaClient'

passport.use(new Strategy(
    async function (key, done) {
        const user = await prisma.users.findFirst({ where: { key: key } })
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
    }));
