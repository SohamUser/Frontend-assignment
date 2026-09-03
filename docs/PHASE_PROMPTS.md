# Phase Prompts — WhatBytes Store

Run these **one at a time**, in order, from `D:\WB-frontend\frontend`. Project setup (Create Next App) is already committed. After each phase: review the diff yourself, then commit with the exact message given, then push — before starting the next phase's prompt in a fresh Codex turn.

Before pasting any phase prompt, make sure Codex has read `/AGENTS.md` and `docs/DESIGN_PRINCIPLES.md` in this session (most Codex CLI setups auto-load `AGENTS.md`; if yours doesn't, paste it manually first).

---

## Phase 1 — Storefront foundation

> Inspect the existing Next.js 16 App Router project before editing. Implement only the storefront foundation:
>
> - Install `lucide-react`.
> - Define strict TypeScript types for `Product`, `Category`, and cart-ready product IDs.
> - Add a local mock catalog of exactly 10 products across Electronics, Clothing, and Home: Running Shoes ($99), Wireless Headphones ($199), Backpack ($129), Smartwatch ($249), Sunglasses ($149), Digital Camera ($499), T-Shirt ($29), Smartphone ($699), Table Lamp ($89), and Coffee Maker ($159).
> - Give every product a stable slug-like ID, title, price, category, description, rating with half-star values, image path, and a `featured` flag. Only Smartphone should be featured.
> - Add suitable optimized product images under `public/products` using predictable filenames. Prefer clean product cutouts or neutral-background images and do not hotlink unstable URLs.
> - Replace the starter metadata with "WhatBytes Store" metadata.
> - Establish reusable Tailwind/CSS theme values based on navy `#0f2a5c`, blue `#1e50b8`, page gray `#f4f6fa`, and footer navy `#071b3f`. Remove the automatic dark-mode styling.
> - Do not build product cards, filters, search logic, routes, or cart functionality yet.
> - Run `npm run lint` and `npm run build`.
> - Do not commit or push. Summarize changed files and any verification results.

**Commit:** `chore: add storefront foundation and product catalog`

---

## Phase 2 — Header, footer, and layout shell

> Continue from the current repository state and implement only the shared storefront shell:
>
> - Create a responsive header matching the reference: WhatBytes logo on the left, centered search field with Search icon and placeholder "Search for products...", dark Cart pill with ShoppingCart icon and zero badge, plus a circular profile/avatar using the UserRound icon.
> - Make the logo link to `/` and the cart pill link to `/cart`.
> - The search field is visual-only in this commit, but structure the component so it can later accept a controlled value and change handler.
> - Create the dark navy footer with three columns: Filters links, About Us links, and Facebook/Twitter/Instagram icon buttons.
> - Add `© 2026 WhatBytes Store`.
> - Create a reusable page shell with a light gray background, sensible max width, and a footer that remains at the bottom on short pages.
> - Ensure keyboard focus styles, semantic landmarks, and mobile header wrapping.
> - Do not implement product cards, filtering, routes, or cart state.
> - Run lint and production build.
> - Do not commit or push.

**Commit:** `feat: add responsive header and layout shell`

---

## Phase 3 — Product grid and cards

> Implement the home-page product presentation only:
>
> - Add the "Product Listing" heading and responsive grid: one column mobile, two tablet, three desktop.
> - Create reusable standard product cards with `next/image`, title, formatted dollar price, rating, and full-width blue Add to Cart button.
> - Create an accessible star-rating component supporting full, half, and empty stars.
> - Product images should use `object-contain` or `object-cover` according to the asset while maintaining consistent card heights.
> - Render Smartphone as the featured detail-preview card: image on the left; title, price, rating, description, category, and button on the right. It should span two grid columns on tablet/desktop and fall back to one stacked card on mobile.
> - Card titles/images should link to `/product/[id]`, even though that route will be added later.
> - Add buttons remain presentational in this commit.
> - Keep the sidebar area reserved but do not build filtering yet.
> - Run lint and build. Do not commit or push.

**Commit:** `feat: add product grid and featured product card`

---

## Phase 4 — Category and price filters

> Add the sidebar filtering feature without URL synchronization:
>
> - Build a dark navy "Filters" card matching the reference.
> - Add single-select radio options: All, Electronics, Clothing, and Home.
> - Add one accessible maximum-price range slider from 0 to 1000 with a fixed lower bound of 0. Display `0` and the current maximum below it.
> - Filter the product catalog by category and `product.price <= maxPrice`; category and price must combine.
> - Keep filter state inside the home storefront client component.
> - Add a centered "No products found" empty state when the filtered result is empty.
> - Sidebar should be approximately one quarter width on desktop, with the grid occupying the rest; stack above the grid on mobile.
> - Do not implement search or URL query parameters yet.
> - Run lint and build. Do not commit or push.

**Commit:** `feat: add category and price filters`

---

## Phase 5 — Search filtering

> Connect the header search field to the home product listing:
>
> - Make search controlled by the home storefront state.
> - Filter product titles using case-insensitive substring matching.
> - Combine search with the existing category and maximum-price filters.
> - Trim surrounding whitespace only for matching; do not make normal typing feel broken.
> - Keep the existing no-results state working for all combinations.
> - On non-home pages, the reusable header should allow entering a search and submitting it to `/?q=<value>` rather than requiring home-only callbacks.
> - Do not implement URL synchronization for live home filtering until the next phase.
> - Run lint and build. Do not commit or push.

**Commit:** `feat: add product search filtering`

---

## Phase 6 — URL-based filter synchronization

> Add robust URL query synchronization to the home filters:
>
> - Use App Router navigation APIs (`useSearchParams`, `useRouter`, and `usePathname`) inside a client component wrapped by an appropriate Suspense boundary.
> - Support direct URLs such as `/?category=electronics&price=0-1000&q=phone`.
> - Initialize category, maximum price, and search from the URL.
> - Valid categories are `all`, `electronics`, `clothing`, and `home`. Invalid values fall back to `all`.
> - Parse `price` as `0-<max>`, clamp the maximum to 0–1000, and fall back to 1000 when invalid.
> - Update the URL with `router.replace(..., { scroll: false })`; debounce search changes by roughly 300 ms so typing does not create excessive navigations.
> - Preserve unrelated query parameters.
> - Omit default category/price parameters when they are reset to All and 1000; omit `q` when empty.
> - Browser back/forward navigation must restore the visible filter controls and results.
> - Avoid hydration mismatches and infinite state/URL update loops.
> - Run lint and a production build, because missing Suspense boundaries may only fail during production builds.
> - Do not commit or push.

**Commit:** `feat: synchronize filters with URL query parameters`

---

## Phase 7 — Dynamic product detail page

> Implement `/product/[id]` using Next.js 16 App Router conventions:
>
> - Treat dynamic `params` as asynchronous.
> - Look up products from the local catalog and call `notFound()` for invalid IDs.
> - Add `generateStaticParams` for all 10 products and dynamic product metadata.
> - Render the shared header and footer.
> - Desktop layout: large product image on the left and details on the right. Stack on mobile.
> - Include title, formatted price, rating, description, category, quantity selector with minus/plus controls, and blue Add to Cart button.
> - Quantity may not go below 1.
> - Put interactive quantity behavior in a focused client component; keep catalog lookup and metadata server-side.
> - Add a polished `not-found.tsx` with a link back to the catalog.
> - Add to Cart remains visually present but will be connected to state in the cart phase.
> - Run lint and build. Do not commit or push.

**Commit:** `feat: add dynamic product detail pages`

---

## Phase 8 — Cart context and persistence

> Implement application-wide cart state using React Context:
>
> - Store cart lines as `{ productId, quantity }`, using the local catalog as the source of product details and prices.
> - Expose `addItem(productId, quantity?)`, `incrementItem`, `decrementItem`, `removeItem`, total quantity count, subtotal, and hydration status.
> - Quantity must never be below 1; decrementing a quantity of 1 should leave it at 1 rather than removing it.
> - Persist under the versioned localStorage key `whatbytes-cart-v1`.
> - Hydrate only after mount and guard malformed or outdated stored data.
> - Avoid SSR hydration mismatch: render a stable zero badge until hydration completes.
> - Wrap the app in the provider.
> - Connect all product-card Add to Cart buttons to add one unit.
> - Connect the detail-page button to add the selected quantity.
> - Update the header badge to show the sum of all quantities, not the number of distinct products.
> - Add subtle accessible confirmation feedback after adding an item.
> - Do not build the cart page contents yet.
> - Run lint and build. Do not commit or push.

**Commit:** `feat: add persistent cart context`

---

## Phase 9 — Cart page

> Implement the bonus `/cart` page:
>
> - Use the shared header/footer and persistent cart context.
> - Show each cart item with image, linked title, unit price, quantity controls, line total, and an accessible remove button using a Lucide trash icon.
> - Include a desktop summary card showing subtotal and total; total equals subtotal because shipping is free.
> - Format all money consistently in USD.
> - Show a polished empty-cart state with a ShoppingCart icon and "Continue shopping" link.
> - Disable or stabilize cart rendering until localStorage hydration finishes so there is no empty-state flash or hydration error.
> - Quantity controls must update totals and the header badge immediately.
> - Use responsive layouts: table/card-like rows on desktop and stacked item cards on mobile.
> - Run lint and build. Do not commit or push.

**Commit:** `feat: add cart page and quantity controls`

---

## Phase 10 — Visual polish and full verification

> Perform a focused visual and usability polish pass using the supplied reference image:
>
> - Tighten spacing, typography, navy backgrounds, blue controls, shadows, borders, card radii, image sizing, and grid alignment to closely match the mock.
> - Ensure the featured Smartphone card spans and aligns correctly without leaving awkward grid gaps.
> - Verify the header, sidebar, product grid, detail page, cart, and footer at mobile, tablet, and desktop sizes.
> - Add hover, active, disabled, and `focus-visible` states.
> - Ensure controls have labels, buttons have accessible names, images have useful alt text, and contrast is acceptable.
> - Check long titles, empty results, invalid product IDs, malformed query parameters, refreshed persisted carts, and mobile overflow.
> - Remove unused starter SVGs and dead code only when confirmed unused.
> - Do not change product behavior or add unrelated features.
> - Run `npm run lint` and `npm run build`.
> - Start the development server and perform an end-to-end browser verification of search, filters, URL restoration, product navigation, adding to cart, refresh persistence, quantity changes, and removal.
> - Do not commit or push.

**Commit:** `style: polish storefront and responsive experience`

---

## Phase 11 — README after manual deployment

Deploy the completed app to Vercel yourself first. Then replace `<LIVE_URL>` and `<REPOSITORY_URL>` below before pasting the prompt.

> Update the README for the completed WhatBytes Store assignment:
>
> - Replace the default Create Next App README.
> - Add project overview, screenshots/reference summary, implemented features, technology stack, local setup commands, filtering/query-parameter examples, cart persistence behavior, and project structure.
> - Add the live Vercel URL: `<LIVE_URL>`.
> - Add the public GitHub repository URL: `<REPOSITORY_URL>`.
> - Mention that product data is local mock data and cart data is stored in localStorage.
> - Include exact commands for install, development, lint, and production build.
> - Confirm every documented command and link is correct.
> - Run lint and build one final time.
> - Do not commit or push.

**Commit:** `docs: add setup guide and live deployment link`