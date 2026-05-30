# Axis Design System — Project Spec

Spec-driven progress tracker. Read this before asking about project state — do not scan the codebase to reconstruct it.

Update status inline as work completes: `[ ]` → `[x]`.

---

## Phase 0 — Foundation

- [x] Monorepo scaffolded (pnpm workspace, three packages)
- [x] `packages/tokens` — Style Dictionary pipeline wired, three-tier token model (primitive → semantic → component), `dist/tokens.css` + `dist/index.js` generated

---

## Phase 1 — UI Package Infrastructure

- [x] `packages/ui` — Vite lib config (`vite.config.ts`), `tsconfig.json`, `src/` directory structure (`/components/<component>` folders + `index.ts` barrel)
- [x] Tailwind v4 installed and configured in `packages/ui`, consuming axis-tokens CSS custom properties via `@theme` directive

---

## Phase 2 — Atom Components (from scratch)

- [x] `Button` — primary / secondary / ghost variants, sizes, disabled state; uses `--axis-button-*` tokens
- [x] `TextInput` — text-like input, sizes, fluid mode, label prop / slot, float label, error state; uses `--axis-text-input-*` tokens
- [ ] `Label` — standalone label atom; deferred while labels remain internal to form controls

---

## Phase 3 — Storybook

- [ ] `packages/docs` wired — `@vinodkola/axis-tokens` and `@vinodkola/axis-ui` linked, `tokens.css` imported globally
- [ ] Stories for Button and TextInput (variants + states visible in browser)

---

## Phase 4 — Complex Components (PrimeVue unstyled)

- [ ] PrimeVue installed in unstyled mode, PassThrough API pattern established, no default styles leaking
- [ ] `Table` — sortable columns, row selection; Storybook story
- [ ] `DatePicker` — single date + range; Storybook story
- [ ] `Dialog` — modal with header / body / footer slots; Storybook story

---

## Phase 5 — Theming

- [ ] Dark mode — `[data-theme="dark"]` block in Style Dictionary output; all components flip with zero component changes; Storybook theme toggle

---

## Phase 6 — Release

- [ ] `@changesets/cli` configured for fixed synchronized versioning across `axis-tokens` and `axis-ui`
- [ ] `0.1.0` published to npmjs.com under `@vinodkola` scope
- [ ] Storybook deployed to Vercel
