This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Identidade visual

https://looka.com/editor/235165857

#226b80
#faffb8
#2d8da8
#174958
#feffeb
#f6ff85
```
sistema-gamificacao
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ assets
│     └─ not-found.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (private)
│  │  │  ├─ (tenant)
│  │  │  │  ├─ configuracao
│  │  │  │  │  ├─ categorias
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ empresa
│  │  │  │  │  │  ├─ empresa-client.tsx
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ grupos-permissao
│  │  │  │  │  │  ├─ grupos-permissao-client.tsx
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ personalizacao
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ personalizacao-client.tsx
│  │  │  │  │  ├─ produtos
│  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  └─ produtos-client.tsx
│  │  │  │  │  └─ usuarios
│  │  │  │  │     ├─ page.tsx
│  │  │  │  │     └─ usuarios-client.tsx
│  │  │  │  ├─ equipe
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ error.tsx
│  │  │  │  ├─ forbidden.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ mercado
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ metas
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ perfil
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ pools
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ resgates
│  │  │  │  │  ├─ meus
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ unauthorized.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ trocar-empresa
│  │  │     ├─ page.tsx
│  │  │     └─ trocar-empresa-client.tsx
│  │  ├─ (public)
│  │  │  ├─ layout.tsx
│  │  │  └─ login
│  │  │     ├─ login-client.tsx
│  │  │     └─ page.tsx
│  │  ├─ actions
│  │  │  └─ tenant.ts
│  │  ├─ favicon.ico
│  │  ├─ global-error.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ not-found.tsx
│  ├─ assets
│  │  └─ astro_404.svg
│  ├─ components
│  │  ├─ can-access.tsx
│  │  ├─ layout
│  │  │  └─ topbar.tsx
│  │  ├─ providers.tsx
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ form
│  │     │  ├─ campo.tsx
│  │     │  └─ color-picker.tsx
│  │     ├─ index.ts
│  │     ├─ modal.tsx
│  │     ├─ multi-select.tsx
│  │     ├─ page-header.tsx
│  │     ├─ section-title.tsx
│  │     ├─ stat-card.tsx
│  │     ├─ status-badge.tsx
│  │     └─ theme
│  │        ├─ theme-provider.tsx
│  │        └─ theme-toggle.tsx
│  ├─ contexts
│  │  └─ tenant-context.tsx
│  ├─ lib
│  │  ├─ auth-client.ts
│  │  ├─ auth-server.ts
│  │  └─ tenant-cookie.ts
│  └─ proxy.ts
└─ tsconfig.json

```