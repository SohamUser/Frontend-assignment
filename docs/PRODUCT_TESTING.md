# Product detail checks

Run `npm test`, `npm run lint`, and `npm run build` from the frontend directory.
The route tests cover all catalog IDs, static params, metadata, and unknown IDs.
The build should list all ten pre-rendered product paths.

Run `npm run dev`, then use the printed local URL:

1. Open `/product/smartphone` directly and reload. Confirm its title, $699 price,
   rating, description, category, and product image. The browser title should be
   `Smartphone | WhatBytes Store` and the description meta tag should match the catalog.
2. Open `/`, click a product title, return, and click a product image. Both links
   must open the matching detail page. There should be one shared header and footer.
3. Quantity begins at 1 with Decrease disabled. Increase several times, then
   decrease back to 1. Try keyboard Tab/Enter/Space. Quantity must remain an integer
   and never drop below 1. Choosing a different product starts its quantity at 1.
4. Add to Cart remains disabled at every quantity; the header badge stays at zero.
5. Open `/product/not-a-product`. Expect HTTP 404, “Page not found,” and a working
   “Back to products” link, not a runtime error. Only catalog IDs are pre-rendered;
   `dynamicParams = false` rejects other slugs before a response is streamed.
6. From a detail page, type `phone` into the shared header. Typing must stay on the
   detail page. Submit with Enter or the search icon: expect the home catalog with
   `q=phone` and Wireless Headphones plus Smartphone visible.
7. At mobile widths the image sits above the information. On tablet/desktop they
   sit side by side. Check for undistorted images, visible focus, and no horizontal
   overflow at 320px, 375px, 768px, and 1440px.

No cart page or cart state is implemented in this phase.

Local Windows note: the production preview served `/product/SMARTPHONE` as the
existing lowercase product, consistent with case-insensitive file lookup for
pre-rendered pages. Unknown slugs such as `/product/not-a-product` return 404.
The catalog lookup itself uses exact IDs and is covered by the route tests.
