# Storefront polish and verification

Verified on 2026-09-03 against `docs/DESIGN_PRINCIPLES.md` using the running
Next.js development server at `http://localhost:3000` and the Codex Chromium
browser. The final visual review also used the assignment image subsequently
provided by the user, saved as [assignment-reference.png](assignment-reference.png).

## Final comparison with the supplied reference

- Preserved the two-column Smartphone preview with image, title, price, stars,
  description, category and Add to Cart button.
- Changed its tablet/desktop image frame to a taller portrait crop. The crop
  trims the asset's white side margins while keeping the complete phone visible.
  Increased its requested image resolution to suit that frame; mobile remains
  square and stacked. Checked at 375, 768, 1024 and 1440 pixels.
- Removed the visible product-count row to bring the cards directly under the
  Product Listing heading. The result count remains a screen-reader live region.
- Restored three equal desktop footer columns, matching the reference's spacing.
- Used the image as a composition reference alongside the documented color tokens
  and responsive rules. Retained the real catalog, clear labels and single working
  filter panel instead of the image's placeholder copy and duplicated filter sketch.
- Rechecked combined Electronics/phone filtering, Clear filters, featured-card
  addition, $699 cart refresh persistence, quantity increase to $1,398, removal,
  image loading and browser console logs. No runtime or hydration errors were
  captured. Next.js emitted one image-loading performance hint identifying the
  lazy-loaded Smartwatch image as LCP during the resize/scroll checks; its image
  loaded successfully. This is a remaining performance-tuning opportunity.

## Changes

- `components/products/filter-sidebar.tsx`: compact two-column category choices
  on mobile, category and price sections beside each other on tablet, and the
  existing approximately one-quarter-width desktop sidebar. Added pressed feedback
  to Clear filters.
- `components/products/product-grid.tsx`: dense grid placement fills the tablet
  gap beside T-Shirt with Table Lamp before the spanning Smartphone card.
- `components/products/product-card.tsx` and `app/globals.css`: a defined featured
  price size, tabular price numerals, wrapping titles and rounded image frames.
  The featured card uses an inset navy outline while standard cards retain their
  subtle shadow. Both card types use the same padding and image column width,
  with matching Add to Cart button baselines on desktop; the featured image fills
  a taller frame as shown in the supplied reference.
- `components/cart/add-to-cart-button.tsx`: color transitions and a pressed state.
- `components/layout/site-footer.tsx`: equal desktop columns match the reference,
  social circles align with their heading, and category labels link to
  the existing filtered catalog with keyboard focus and touch-sized targets.
- Removed the unused `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, and
  `window.svg` after checking repository references. Kept the active favicon,
  product images, and other application code.
- Added four regression cases to the existing Node test runner / `tsx` suite in
  `tests/filter-url.test.ts` and `tests/cart.test.ts`. No new test dependency was
  needed for this pass.

## Responsive checks actually performed

| Surface | 375px | 768px | 1440px |
| --- | --- | --- | --- |
| Catalog, header, filters and footer | Inspected | Inspected | Inspected |
| Featured Smartphone card | Stacked, one column | Image/text, two-column span | Image/text, two-column span |
| All ten product detail routes | DOM layout and images checked | DOM layout and images checked | DOM layout and images checked |
| Smartphone detail visual review | Inspected | Inspected | Inspected |
| Populated and empty cart | Inspected | Inspected | Inspected |
| Empty results with a long search input | Inspected | Inspected | Inspected |
| Invalid product route / not-found page | Inspected | Inspected | Inspected |

Checks included document width and descendant bounding rectangles, meaningful
product image alt text, completed image loading, headings, and button names.
All ten detail routes displayed the correct product title, a loaded image and
named controls, without horizontal overflow. Full-catalog images also all loaded.
Screenshots were reviewed for the page templates and the featured card; individual
detail routes additionally shared the same DOM checks at all three widths.

## Browser flows actually performed

- Combined Electronics, search `  pHoNe  ` and keyboard-adjusted maximum price:
  Wireless Headphones alone at $199; zero results at $198. The typed spaces were
  retained in the input and the URL used the trimmed query.
- Clear filters restored All, $1,000, an empty search and all ten products.
- Direct `category=electronics&price=0-199&q=phone&tag=a&tag=b` restored the
  matching product. Navigation to its detail page and browser Back/Forward
  restored the corresponding page and controls. Clear preserved both `tag` keys.
- Malformed `category=unknown&price=oops&q=%20%20&keep=1` restored defaults and
  normalized to `?keep=1`.
- Search from both cart and detail pages stayed on that page while typing and
  returned matching catalog results upon explicit submission.
- The footer Home category link opened the two home products.
- Added Running Shoes twice, then selected three Smartphones on the detail page:
  two cart lines, five units, $198 and $2,097 line totals, $2,295 total.
- Reload restored those quantities and totals. Increasing Shoes changed the total
  to $2,394. Decreasing to one disabled further decrement. Removing Shoes left
  $2,097; removing Smartphone produced the empty cart, which persisted on reload.
- Keyboard Skip to content focused the main landmark. Tab and radio arrow keys,
  slider Home/PageUp/ArrowLeft, product links/buttons, footer links, and keyboard
  removal worked. Removal returned focus to the cart heading. Focus outlines were
  visible on both light and navy surfaces. Loading cart buttons and minimum
  quantity decrement showed disabled states.
- Inspected accessible labels for search, cart count, rating stars, quantity
  controls, removal, notifications, and social links. Product images have useful
  alt text. The notification dismiss button worked.

The original functional pass returned no warnings or errors, including no
hydration warnings. The final reference review produced the image-loading hint
recorded above, with no runtime or hydration errors.

## Contrast and automated verification

Calculated contrast ratios from the specified sRGB theme colors:

| Foreground / background | Ratio |
| --- | --- |
| White / navy | 13.94:1 |
| White / blue button | 7.25:1 |
| Muted text / white | 6.26:1 |
| Muted text / page background | 5.79:1 |
| Light muted text / footer navy | 11.71:1 |
| Blue link / page background | 6.70:1 |

- `npm test`: **99 passed**, zero failed. The four new cases cover query
  canonicalization with combined matching, duplicate/encoded query keys,
  multi-product totals through changes and persistence, and the safe cent limit
  across different products. Existing hydration, storage failure and filter
  timing regressions also passed.
- `npm run lint`: passed without warnings.
- `npm run build`: passed, including TypeScript and all 15 generated pages.

## Limits and layout tradeoffs

- The supplied image is a small composition reference, not a pixel-exact target:
  the documented brand colors, responsive breakpoints, ten-product catalog and
  functional controls take precedence over placeholder details in the image.
- Browser interaction checks used the development server in Chromium. The
  production build was compiled successfully but was not browser-tested.
- No physical-device, Safari, Firefox, screen-reader, or exhaustive accessibility
  audit was performed. Contrast checks cover the listed theme pairs.
- Dense packing can place a later card visually above Smartphone to fill a hole;
  keyboard and screen-reader order still follow the catalog. Filtered lists can
  have partially filled rows when there are insufficient cards to fill them.
- Corrupted or blocked storage and numeric overflow were exercised by automated
  tests, not by altering the browser's storage configuration.
