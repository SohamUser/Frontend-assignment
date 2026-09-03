# How to Use These Docs With Codex

## File layout

Put these at the root of `D:\WB-frontend\frontend`:

```
frontend/
├── AGENTS.md                    ← Codex CLI auto-loads this every session
└── docs/
    ├── PHASE_PROMPTS.md          ← the 11 numbered prompts, paste one per turn
    ├── DESIGN_PRINCIPLES.md      ← tokens + anti-slop checklist, referenced by AGENTS.md
    └── USAGE.md                  ← this file, for you, not for the agent
```

`AGENTS.md` is the file Codex CLI (and most modern coding agents) look for automatically at the repo root — you shouldn't need to paste it manually each session, but do a quick sanity check the first time by asking Codex "what does AGENTS.md say to do" and confirming it picked it up.

## Per-phase workflow

1. Open a **fresh Codex session/turn** for each phase — don't chain phases in one continuous conversation, since that's how scope creep sneaks in (the agent "remembers" it already touched cart logic and starts wiring it early).
2. Copy the exact prompt block for that phase from `docs/PHASE_PROMPTS.md` and paste it as your instruction.
3. Let Codex implement, lint, build, and summarize. It's instructed not to commit — review its summary and diff yourself first.
4. If the diff looks right and matches `docs/DESIGN_PRINCIPLES.md`'s checklist, commit and push manually:

```powershell
git status
git diff
git add .
git commit -m "<commit message shown in PHASE_PROMPTS.md for that phase>"
git push origin main
```

5. Move to the next phase's prompt in a new turn.

## First-time repo setup (before Phase 1)

```powershell
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

## Between phases: quick review pass

Before committing, skim the diff against the anti-slop checklist in `docs/DESIGN_PRINCIPLES.md` — it's short by design so you can actually run it every time, not just at the polish phase. Catching a generic-looking card shadow or a stray `→` on a button in phase 3 is much cheaper than catching it in phase 10.

## After Phase 10, before Phase 11

Deploy manually to Vercel, confirm the production URL works, then fill in `<LIVE_URL>` and `<REPOSITORY_URL>` in the Phase 11 prompt before pasting it.

## Reusing this setup for future assignments

`AGENTS.md` and `docs/DESIGN_PRINCIPLES.md` are written to be mostly reusable — the operating rules (one phase at a time, don't commit unassisted, run lint/build, accessibility floor) and the anti-slop checklist apply beyond this specific project. For a new assignment, keep those two, swap out the color tokens and the phase-specific catalog details, and write a fresh `PHASE_PROMPTS.md`.