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

Open [http://192.168.18.6:3000](http://192.168.18.6:3000) with your browser to see the result.

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

```
sistema-gamificacao
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  └─ assets
│     ├─ avatar-login.svg
│     ├─ not-found.svg
│     └─ purpel-await.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (private)
│  │  │  ├─ (app)
│  │  │  │  ├─ configuracoes
│  │  │  │  │  ├─ categorias
│  │  │  │  │  │  ├─ categorias-client.tsx
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
│  │  │  │  │  ├─ mercado-client.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ metas
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ perfil
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ perfil-client.tsx
│  │  │  │  ├─ pools
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ resgates
│  │  │  │  │  ├─ meus
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ unauthorized.tsx
│  │  │  │  └─ _components
│  │  │  │     ├─ card-historico.tsx
│  │  │  │     ├─ card-meta.tsx
│  │  │  │     ├─ card-ranking.tsx
│  │  │  │     ├─ chart-evolucao-mensal.tsx
│  │  │  │     ├─ chart-resgates-metas.tsx
│  │  │  │     ├─ chart-top-funcionarios.tsx
│  │  │  │     ├─ chart-top-por-equipe.tsx
│  │  │  │     ├─ dashboard-admin.tsx
│  │  │  │     ├─ dashboard-gestor.tsx
│  │  │  │     ├─ dashboard-jogador.tsx
│  │  │  │     └─ use-admin-charts.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ trocar-empresa
│  │  │     ├─ page.tsx
│  │  │     └─ trocar-empresa-client.tsx
│  │  ├─ (public)
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  ├─ login-client.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ recuperar-senha
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ recuperar-senha-client.tsx
│  │  │  └─ redefinir-senha
│  │  │     ├─ page.tsx
│  │  │     └─ redefinir-senha-client.tsx
│  │  ├─ actions
│  │  │  └─ tenant.ts
│  │  ├─ favicon.ico
│  │  ├─ global-error.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  └─ primeiro-acesso
│  │     └─ page.tsx
│  ├─ components
│  │  ├─ index.ts
│  │  ├─ layout
│  │  │  ├─ filtros-categorias.tsx
│  │  │  ├─ modal-confirmar-resgate.tsx
│  │  │  ├─ modal.tsx
│  │  │  ├─ produto-card.tsx
│  │  │  └─ stat-card.tsx
│  │  ├─ shell
│  │  │  └─ topbar.tsx
│  │  └─ ui
│  │     ├─ avatar.tsx
│  │     ├─ aviso-banner.tsx
│  │     ├─ can-access.tsx
│  │     ├─ form
│  │     │  ├─ campo.tsx
│  │     │  └─ color-picker.tsx
│  │     ├─ multi-select.tsx
│  │     ├─ page-header.tsx
│  │     ├─ section-title.tsx
│  │     ├─ status-badge.tsx
│  │     └─ theme
│  │        ├─ theme-provider.tsx
│  │        └─ theme-toggle.tsx
│  ├─ contexts
│  │  └─ tenant-context.tsx
│  ├─ hooks
│  ├─ lib
│  │  ├─ auth-client.ts
│  │  ├─ auth-server.ts
│  │  └─ tenant-cookie.ts
│  ├─ providers.tsx
│  ├─ proxy.ts
│  └─ types.ts
└─ tsconfig.json

```