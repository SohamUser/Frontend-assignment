# Local filtering checks

Run `npm test`, `npm run lint`, and `npm run build` from the frontend directory.
The tests use Node's test runner through `tsx` and exercise the pure matching
function against the catalog, including every exact product-price boundary.

For browser checks, run `npm run dev` and open the printed local URL:

1. Initially all 10 products appear, All is selected, and the price bounds are $0–$1,000.
2. Select Electronics, Clothing, and Home: expect 4, 4, and 2 products respectively.
3. Clear filters, then search for `  pHoNe  ` (including spaces): expect Wireless
   Headphones and Smartphone. The input must retain the spaces as typed.
4. Select Electronics. Drag Maximum price near $199 and fine-tune with the arrow
   keys until the visible upper bound is exactly $199. Only Wireless
   Headphones remains. At $198, the empty-state message appears.
5. Clear filters. Set the slider to its minimum with Home: expect “No products
   found. Try adjusting your filters.” Press End: all 10 products return.
6. Set a category, lower the price, and enter a search. Clear filters must reset
   all three controls together and restore all 10 products.
7. Verify visible keyboard focus, radio arrow-key navigation, and slider keys.
   At mobile widths the sidebar sits above the grid; on desktop it takes roughly
   one-quarter of the container. The Smartphone preview still stacks on mobile.
8. Filter changes must not change the URL. A full reload resets this local state.
   Cart buttons remain disabled; product and cart routes are still deferred.

The result count is a polite live region; individual stars are hidden from
assistive technology in favor of the existing accessible rating label.
