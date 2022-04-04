This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```
mlvcs
├─ .dockerignore
├─ .eslintrc.json
├─ .gitignore
├─ components
│  ├─ Form.tsx
│  ├─ Header
│  │  ├─ Header.tsx
│  │  └─ index.ts
│  ├─ Layout.tsx
│  ├─ Nav
│  │  ├─ index.ts
│  │  ├─ Nav.tsx
│  │  └─ NavItem.tsx
│  ├─ RepoHeading
│  │  ├─ index.ts
│  │  └─ RepoHeading.tsx
│  ├─ Search
│  │  ├─ index.ts
│  │  └─ Search.tsx
│  ├─ Tabs
│  │  ├─ index.ts
│  │  ├─ Tab.tsx
│  │  ├─ Tabs.tsx
│  │  └─ TabTitle.tsx
│  └─ User
│     ├─ index.ts
│     └─ User.tsx
├─ docker-compose.yml
├─ Dockerfile
├─ healthcheck.js
├─ lib
│  ├─ auth
│  │  ├─ auth-bearer.ts
│  │  └─ rollKey.ts
│  ├─ auth-cookies.ts
│  ├─ auth.ts
│  ├─ hooks.ts
│  ├─ passport-local.ts
│  ├─ prismaClient.ts
│  ├─ upl.js
│  ├─ user.ts
│  └─ UserStorage.ts
├─ LICENSE
├─ next-env.d.ts
├─ next.config.js
├─ package.json
├─ pages
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ login.ts
│  │  │  ├─ logout.ts
│  │  │  └─ signup.ts
│  │  ├─ repos
│  │  │  └─ index.ts
│  │  ├─ search.ts
│  │  ├─ settings
│  │  │  ├─ account
│  │  │  │  └─ index.ts
│  │  │  ├─ keys.ts
│  │  │  └─ profile
│  │  │     └─ index.ts
│  │  ├─ upload.ts
│  │  └─ user.ts
│  ├─ index.tsx
│  ├─ login.tsx
│  ├─ overview.tsx
│  ├─ settings
│  │  ├─ account.tsx
│  │  ├─ keys.tsx
│  │  └─ profile.tsx
│  ├─ signup.tsx
│  ├─ [user]
│  │  ├─ index.tsx
│  │  └─ [repo]
│  │     ├─ index.tsx
│  │     ├─ settings.tsx
│  │     └─ [model]
│  │        └─ index.tsx
│  └─ _app.tsx
├─ prisma
│  └─ schema.prisma
├─ public
│  ├─ favicon.ico
│  ├─ fonts
│  │  ├─ RobotoMono-Italic-VariableFont_wght.ttf
│  │  └─ RobotoMono-VariableFont_wght.ttf
│  └─ vercel.svg
├─ README.md
├─ styles
│  ├─ colors.scss
│  ├─ Dropdown.module.scss
│  ├─ fonts.scss
│  ├─ globals.scss
│  ├─ Header.module.scss
│  ├─ Home.module.scss
│  ├─ Nav.module.scss
│  ├─ RepoHeading.module.scss
│  ├─ Search.module.scss
│  ├─ Settings.module.scss
│  ├─ Tabs.module.scss
│  └─ User.module.scss
├─ tsconfig.json
└─ yarn.lock

```