# AGENTS.md — Operating Rules for This Repo

You are working on **WhatBytes Store**, a Next.js 16 storefront assignment. Read this file in full before touching any code, on every session.

## Non-negotiables

1. **One phase at a time.** The full build is broken into numbered phases in `docs/PHASE_PROMPTS.md`. Only implement the phase you were explicitly given. Do not build ahead (no cart logic while doing the product grid, no URL sync while doing search, etc.) even if it seems convenient or "obviously next."
2. **Inspect before you edit.** Read the current state of the repo/files you're about to touch before writing anything. Don't assume file contents from earlier phases.
3. **Never commit or push unless the prompt or the user explicitly says to.** Default is: implement, verify, summarize, stop. Git actions are a manual step the user runs themselves.
4. **Always run `npm run lint` and `npm run build` at the end of a phase**, and report the result honestly, including warnings. If build fails, fix it before summarizing — don't hand back a broken build.
5. **Summarize changed files** at the end of every phase: what changed, why, and any verification output. No filler.
6. **Stay in scope.** If a phase prompt says "do not implement X yet," treat that as a hard boundary, not a suggestion — even if X would be trivial to add right now.

## Design rules (full detail in `docs/DESIGN_PRINCIPLES.md` — read it before any UI work)

This is a real assignment being graded against a reference design, not a generic AI-generated storefront. Follow the reference and the tokens in `docs/DESIGN_PRINCIPLES.md` exactly. Specifically avoid, unless the reference literally shows it:

- Eyebrow labels in tracked-out ALL CAPS above headings
- Every card sharing identical border-radius + identical soft grey box-shadow with no hierarchy
- Fade-and-slide-up entrance animation on every section/card, or a hover-lift on every card, just because it's easy to add
- A `→` tacked onto every link/button label
- Middle-dot separated meta strings (`A · B · C`) or em-dash labels (`Word — fragment`)
- Monospace font for small data labels "because it looks technical"
- Numbered markers (01/02/03) unless the content is genuinely a sequence
- Gradient washes used purely as decoration

If in doubt whether a treatment is a genuine choice for this brief or just the default reach, check `docs/DESIGN_PRINCIPLES.md`'s token list and the supplied reference image before adding it.

## Accessibility floor (every phase, not just the polish pass)

- Visible `:focus-visible` states on all interactive elements
- Semantic landmarks (`header`, `nav`, `main`, `footer`)
- Accessible names on icon-only buttons (cart, remove, quantity +/-)
- Alt text on all product images
- Don't regress mobile responsiveness while building a later phase

## Reference docs

- `docs/PHASE_PROMPTS.md` — the exact numbered prompts to run, one per session, with their commit messages
- `docs/DESIGN_PRINCIPLES.md` — color/type/layout tokens and the full anti-slop checklist
- `docs/USAGE.md` — how the human is running this workflow (for your context only, not instructions to you)