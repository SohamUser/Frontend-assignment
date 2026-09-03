# Cart verification

Run `npm test`, `npm run lint`, and `npm run build` from the frontend directory.
Cart tests cover merging, minimum quantity, removal, totals, invalid data, corrupt
JSON, blocked storage getters/reads, quota errors, repeated announcements, and
the no-write-before-hydration guard. All money calculations use catalog prices
and integer cents; quantities that would overflow safe totals are rejected.

## Browser flow

Run `npm run dev` and open its printed URL. Use an empty test cart (remove existing
items through the UI first):

1. Open `/cart`. Expect a loading state before hydration, then “Your cart is empty.”
   Follow Browse products. Product buttons enable once cart hydration completes.
2. Add Running Shoes twice from its card. Expect one cart line, quantity 2, a
   badge count of 2, and an accessible confirmation for each addition.
3. Open Smartphone, select quantity 3, and add it. Expect badge 5. Open `/cart`:
   Shoes line total $198, Smartphone line total $2,097, subtotal and total $2,295.
4. Reload `/cart`: the same lines, quantities, and totals must return. The saved
   key is `whatbytes-cart-v1` and its JSON array contains only `productId` and
   `quantity`, never prices or product details.
5. Increase/decrease each line. Decrease disables at 1; it must never remove the
   line. Remove Shoes explicitly, then remove Smartphone: expect the empty state
   and badge 0. Reload again and confirm it stays empty.
6. Verify product images/titles link to details, header search still submits to
   the home catalog, and mobile layouts have no horizontal overflow. Check keyboard
   focus and the notification's Dismiss button. Removal returns focus to Your Cart.

## Corrupted or unavailable storage

The automated tests use isolated storage fixtures; they do not modify a real
browser profile. For an optional manual test, use DevTools Application/Storage on
your **test origin only**, save a copy of its cart value, then replace that key with:

- `broken-json`: reload; expect an empty working cart and a recovery message.
- `[{"productId":"unknown","quantity":2},{"productId":"smartphone","quantity":0},{"productId":"t-shirt","quantity":2}]`:
  reload; only two T-Shirts should remain, totaling $58.
- A valid line with a forged `price`: totals must still use the catalog price.

Restore your copied test value afterward if needed. When storage access or writing
is blocked, the cart stays usable in memory and displays a persistence warning;
reload persistence cannot be promised while the browser blocks storage.

This demo intentionally has no checkout, payments, accounts, or backend services.
