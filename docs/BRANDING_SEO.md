# WhatBytes branding and SEO

## Brand assets

The header uses a shopping-bag W mark with the live-text WhatBytes wordmark. The home link has an accessible name; its image is decorative to avoid repeating the brand to screen readers.

- `public/brand/whatbytes-logo.png`: full-resolution 1254px generated master.
- `public/brand/whatbytes-mark.png`: 128px header asset, displayed at 32–36px.
- `app/favicon.ico`: 16px, 32px, and 48px RGBA PNG frames.
- `app/icon.png`: 192px browser icon.
- `app/apple-icon.png`: 180px Apple touch icon.
- `app/og/route.tsx`: static 1200 × 630 branded social preview, served at `/og`.
- `docs/brand-social-preview.png`: verified export of the social preview.

Generated using the built-in image generation tool, then exported to icon sizes with Sharp. Original generated files remain outside the repository as well. Final refinement prompt:

> Edit this logo into a flat production brand icon. Preserve exactly the white shopping bag W silhouette and small blue square. Remove ALL glow, haze, shadows, texture and gradients. Background must be completely opaque uniform solid navy #0f2a5c edge to edge. White mark pure white #ffffff with crisp antialiased edges; tiny blue square flat #1e50b8. Center symbol occupying 80% of square. No transparency, no lettering, no additions. It must look like clean flat vector art, not a glowing illustration. Square icon.

## Public domain configuration

Set `SITE_URL` to the final public origin **before running the production build**, for example `https://your-domain.com`. Use the actual domain, without a path, query, or fragment. `.env.example` documents this setting; `.env.local` stays ignored. Restart the development server after changing it. Rebuild production whenever the public origin changes because these pages and metadata routes are prerendered.

No public domain was supplied during implementation. With `SITE_URL` blank:

- Pages use `noindex, follow`; `robots.txt` disallows crawling.
- The sitemap is empty and canonical URLs are omitted.
- Social image URLs resolve against localhost for local testing.

Once configured, home and product pages become indexable, canonical and social URLs use that origin, and `/sitemap.xml` lists the homepage plus all 10 product routes. Query variations canonicalize to the homepage. The cart always remains `noindex, follow` and is excluded from the sitemap. Unknown product routes return HTTP 404.

## Implemented SEO

Page-specific titles/descriptions, Open Graph and Twitter cards, favicon/touch-icon discovery, theme color, canonical URLs, robots rules, and sitemap routes use Next.js metadata APIs. Product pages include escaped Product and BreadcrumbList JSON-LD; the configured homepage includes WebSite JSON-LD.

The mock catalog is illustrative, so structured data deliberately excludes invented offers, stock claims, review counts, and customer reviews. This basic Product schema does not claim eligibility for Google's product rich results. Replace it with verified commercial data if this becomes a real store.

URL observation now has its own small Suspense boundary. The homepage catalog and product details appear in initial production HTML instead of being replaced by a loading message. Query filters apply after hydration using a stable server snapshot.

References: [Next.js metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata), [query rendering and Suspense](https://nextjs.org/docs/app/api-reference/functions/use-search-params), [JSON-LD](https://nextjs.org/docs/app/guides/json-ld), [Google product structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).

## Verification

- Automated suite: 106 tests, including SEO origin validation, canonical catalog URLs, sitemap exclusions, safe JSON-LD serialization, catalog metadata, and query hydration with no recoverable errors.
- Lint and production build pass. The initial ICO export required conversion to RGBA; the corrected ICO builds and serves successfully.
- Header inspected at 375px, 768px, and 1440px; logo and wordmark fit with the existing search and cart controls.
- No horizontal overflow at those widths; the logo home link has visible white keyboard focus. A fresh production browser session reported no console warnings or errors. The earlier development session logged an image LCP advisory and a normal Fast Refresh full-reload warning while files were edited.
- Production HTTP checks: all 10 product routes return 200 with titles, visible server-rendered headings, and matching JSON-LD. Unknown product returns 404. Cart has noindex metadata.
- The unknown-product HTTP probe also produced a Next.js server-side `Internal: NoFallbackError` log with the existing `dynamicParams = false` boundary. The response was the expected 404; this framework log remains a limitation, separate from the clean production browser console.
- Favicon, PNG icon, Apple icon, header mark, social preview, robots, and sitemap return 200 with the expected content types. Social preview inspected at 1200 × 630.
- Production browser checks: combined direct query filters, search/category changes, Clear filters, product navigation, back/forward restoration, cart addition, refresh persistence, quantity changes ($699 → $1,398 → $699), and removal.

Live-domain crawling, search-engine indexing, Search Console ownership/submission, and external social-card fetches require the final hosted URL and were not performed. No deployment was made.
