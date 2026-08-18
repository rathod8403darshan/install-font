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

## Font catalog

Category pages (`/fonts/movie`, `/music`, `/game`, `/logo`, `/book`) are
populated from `src/data/font-categories/*.json`. Each file holds ~200 Google
Fonts families and is the source of truth at build time.

Regenerate the JSON with:

```bash
npm run catalog
```

The script (`scripts/build-font-catalog.mjs`) tries, in order:

1. `https://www.googleapis.com/webfonts/v1/webfonts` when
   `GOOGLE_FONTS_API_KEY` (see `.env.example`) is set.
2. The public `https://fonts.google.com/metadata/fonts` endpoint (no auth).
3. The embedded curated list in `scripts/fallback-catalog.mjs`.

Raw responses are cached in `scripts/.cache/webfonts.json` (git-ignored). The
runtime UI never reads any API key - each category page injects a single
`fonts.googleapis.com/css2` `<link>` for the 20 families on the current page.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
