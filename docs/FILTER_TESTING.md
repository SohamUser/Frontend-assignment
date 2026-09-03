# Filtering and URL synchronization checks

Run `npm test`, `npm run lint`, and `npm run build` from the frontend directory.
The tests use Node's test runner through `tsx` and exercise the pure matching
function against the catalog, including every exact product-price boundary.
They also cover URL parsing/serialization and the URL store with a deterministic
clock: 300 ms debounce, in-flight replacements, reset, navigation, and submission.

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
8. Category and price changes update the URL immediately; typing updates results
   immediately and the URL after 300 ms without typing. Enter or the search icon
   submits immediately. Changes replace the current history entry without
   requesting a scroll to the top. Reload must restore the URL's controls/results.

## URL regression checks

- Open `/?category=electronics&price=0-1000&q=phone&campaign=demo&tag=a&tag=b`.
  Expect two products, Electronics, $0–$1,000, and `phone`. The default `price`
  parameter disappears, but `campaign` and both `tag` values remain.
- Open `/?category=unknown&price=oops&q=%20%20&keep=1`: expect All, maximum
  $1,000, and all products. The URL normalizes to `/?keep=1`.
- Check `price=0-1200` (clamps to 1000), `price=0--10` (clamps to zero), and
  `price=0-99.5` (preserves the fractional bound). A nonzero lower bound is malformed.
  Duplicate filter keys use the first value and normalize to a single value.
- Type a search, then change category and price before 300 ms elapses. All three
  changes must survive in the final URL. Type again and immediately Clear filters:
  controls and URL must remain reset after the debounce interval.
- Open a filtered URL, follow the home logo to `/`, then use browser Back and
  Forward. The controls and products must follow each restored URL. Start typing
  immediately before navigating to verify an old timeout never restores that query.
- Clear filters removes only `category`, `price`, and `q`; unrelated keys survive.
- From a product detail page, submit a shared header search to return to `/?q=...`;
  typing there does not navigate until submit. See `PRODUCT_TESTING.md` for details.
  Repeat from `/cart`; typing must stay on the cart page until submission.

Cart buttons enable after cart hydration. Filter edits use replace, so each keystroke does not
create a Back-button entry; navigate between pages/links when testing history.

The result count is a polite live region; individual stars are hidden from
assistive technology in favor of the existing accessible rating label.
