# WhatBytes Store

A responsive storefront built for the WhatBytes frontend assignment. Browse a local product catalog, search and filter products, view product details, and manage a cart that persists across page reloads.

**Live demo:** [frontend-assignment-nine-gamma.vercel.app](https://frontend-assignment-nine-gamma.vercel.app/)

## Features

- Responsive product grid with images, prices, ratings, and a featured product.
- Search, category filters, and a maximum-price slider, with filter state stored in the URL for sharing and browser navigation.
- Product detail pages with quantity selection and add-to-cart controls.
- Cart quantity updates, item removal, item counts, and calculated totals.
- Cart persistence using `localStorage`, with a warning when browser storage is unavailable.
- Cart notifications that dismiss automatically after three seconds. Each new cart action restarts the timer, and notifications can also be closed manually.
- Accessible labels, keyboard focus styles, a skip link, and live cart announcements.
- Page metadata, social previews, product structured data, and configurable sitemap and robots output.

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Lucide React icons
- React Context and a reducer for cart state
- Node.js test runner, `tsx`, and JSDOM
- Vercel hosting

## Run locally

Use Node.js 22 or newer and npm.

```bash
git clone https://github.com/SohamUser/Frontend-assignment.git
cd Frontend-assignment
npm ci
npm run dev
```

Run npm commands from the directory containing `package.json`. In the original workspace, this is `WB-frontend/frontend`.

Open [localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build and check TypeScript |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the automated test suite |

To run the production app locally, run `npm run build` followed by `npm start`.

## Environment configuration

No environment variables are required. Canonical links, social previews, structured data, and the sitemap default to the live Vercel origin. You can override it with `SITE_URL` before building:

```dotenv
SITE_URL=https://frontend-assignment-nine-gamma.vercel.app
```

For local configuration, copy `.env.example` to `.env.local` and edit the value. To override the origin on Vercel, update the project's Production environment variables and redeploy.

Use an HTTP(S) origin without a path, query, or fragment. An unset `SITE_URL` uses the live address above. An explicitly blank `SITE_URL` opts out: pages use `noindex`, crawling is blocked, and the sitemap is empty.

## Project structure

```text
app/                  Routes, layouts, metadata, and global styles
  cart/               Shopping cart page
  product/[id]/       Product detail pages
  og/                 Social preview image route
components/           Cart, product, and shared layout components
context/              Cart and product filter providers
data/products.ts      Local product catalog
lib/                  Cart, storage, filtering, URL, pricing, and SEO helpers
public/               Product images and static assets
tests/                Automated behavior, rendering, and hydration tests
types/                Shared TypeScript types
docs/                 Assignment workflow and design documentation
```

## Deploy on Vercel

1. Import the GitHub repository into Vercel.
2. Select the Next.js framework preset and use the directory containing `package.json` as the Root Directory.
3. The public origin defaults to `https://frontend-assignment-nine-gamma.vercel.app`. Set `SITE_URL` in the Production environment only if using another domain; remove any blank override to use the default.
4. Deploy using the `npm run build` build command.

With the Git integration enabled, pushes to the configured production branch trigger a new deployment.

## Demo scope

Products, prices, images, and ratings are illustrative. There is no backend, authentication, checkout, payment processing, or order fulfillment. Cart data stays in the current browser and is not synchronized between devices.
