# Design Principles — WhatBytes Store

Read this before any phase that touches UI (phases 1–3, 10 especially). The goal is a storefront that looks like it was designed for WhatBytes specifically, matched to the supplied reference image — not a generic "AI SaaS card grid" that could be any product.

## Token system (already fixed by the brief — do not deviate)

**Color**
- Navy (primary brand / header, filter card): `#0f2a5c`
- Blue (interactive / buttons, links, active states): `#1e50b8`
- Page background: `#f4f6fa`
- Footer navy (darker than header navy): `#071b3f`
- Neutral text: near-black, not pure `#000` and not a tinted `#0B0B0B` "AI-black" — use a proper dark neutral gray (e.g. `#1a1f2b`) for body text, reserve navy for brand chrome.
- No dark mode. Remove the Next.js starter's automatic `prefers-color-scheme` dark styles entirely.

**Type**
- One or two families max, clearly distinct if two. Don't reach for a serif-display + sans-body combo by default — this is a functional e-commerce UI, not an editorial site; a well-set sans-serif system (or a single humanist sans like Inter) for both display and body is appropriate unless the reference shows otherwise.
- Set an actual type scale (not ad-hoc `text-lg`/`text-xl` guessing) with intentional weights for price, title, and body.
- Line length under ~80 characters for descriptions.
- No accenting a single word in a heading with italics/color. No ALL-CAPS section labels.

**Layout**
- Header: logo left / search center / cart pill + avatar right. Don't invent an extra nav row that isn't in the reference.
- Sidebar filters: dark navy card, ~1/4 width desktop, stacks above grid on mobile.
- Product grid: 1 col mobile / 2 tablet / 3 desktop. Featured product spans 2 columns on tablet/desktop, not a special floating layout invented from scratch.
- Footer: three-column dark navy, not a generic 4-column mega-footer.

## Anti-slop checklist — actively avoid these unless the reference literally shows them

These are the load-bearing tells of a generated storefront. Check every phase's output against this list before calling it done:

- [ ] No identical border-radius + identical soft grey `rgba(0,0,0,.1)` shadow slapped on every card regardless of whether that card is a product, a filter, or a summary panel. Give cards hierarchy — the featured product card should read as more important than a standard card, not just "bigger."
- [ ] No fade-and-slide-up entrance animation on every card/section on scroll. If you add any non-interactive motion, spend it in exactly one place (e.g. the add-to-cart confirmation), not scattered everywhere.
- [ ] No `→` appended to "Add to Cart," "Continue shopping," or other button/link text.
- [ ] No middle-dot separated meta strings or em-dash labels anywhere (product meta, filters, footer).
- [ ] No monospace font for prices, ratings, or category labels "for a technical look" — this is a consumer storefront.
- [ ] No numbered 01/02/03 markers on filters or footer columns — they aren't a sequence.
- [ ] No decorative gradient washes behind the hero/grid.
- [ ] No tracked-out ALL-CAPS eyebrow label above "Product Listing" or "Filters."
- [ ] Star rating component should read clearly at a glance (full/half/empty), not be a decorative flourish.

## Motion

Non-user-triggered motion should be rare and deliberate — at most one orchestrated moment (e.g. initial grid reveal). Motion that responds to a user action (opening a drawer, confirming add-to-cart, quantity changing) is welcome because it communicates state change, not decoration.

## Copy voice

- Buttons state the action in active voice: "Add to Cart," not "Submit." Keep the same verb/label through the flow (a Remove button removes; don't call it "Delete" in one place and "Remove" in another).
- Empty states (no results, empty cart) explain what happened and what to do next, plainly — "No products found. Try adjusting your filters," not a cute illustration-driven message with no direction.
- No filler marketing copy in product descriptions — plain, specific, useful.

## Self-check before ending a UI phase

Ask: if I ran this exact prompt for a different storefront brand with different brand colors, would the layout/motion/copy choices look identical? If yes, something in this phase defaulted instead of being chosen for WhatBytes. Revise before summarizing.