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

- [x] `Button` — filled / outlined / text emphasis, primary / danger severity, sizes, inferred icon-only mode, disabled state; uses `--axis-button-*` tokens
- [x] `Icon` - Lucide-compatible component prop API, tokenized sizes / stroke weights, decorative and meaningful accessibility behavior; uses `--axis-icon-*` tokens
- [x] `TextInput` — text-like input, sizes, fluid mode, label prop / slot, float label, error state; uses `--axis-text-input-*` tokens
- [x] `Label` — standalone label atom; required / disabled states; uses `--axis-label-*` tokens

---

## Phase 3 — Storybook

- [x] `packages/docs` wired — token CSS imported globally, UI stories colocated with component source and discovered by Storybook
- [x] Stories for Button and TextInput (variants + states visible in browser)
- [x] Upgrade to Storybook 10 and configure Docs plus core Controls, Actions, and viewport testing
- [x] Enable Storybook Docs' native table of contents globally for documentation section headings
- [x] Add consolidated Styles/Icons documentation for Lucide usage, Axis token guidance, Icon API, and accessibility
- [x] Add Styles/Colors documentation showing primitive and semantic color tokens with component-token guidance
- [x] Establish a reusable component documentation template covering Overview with an untitled common example, Usage, Variants, API, and Accessibility
- [ ] Add interactive Controls panels for public component props using typed `args` and `argTypes`, including sensible controls, options, defaults, descriptions, and disabled controls for non-editable values
- [x] Add complete Button documentation using the component documentation template
- [ ] Add complete TextInput documentation using the component documentation template
- [ ] Document component slots and emitted events alongside props where applicable
- [ ] Verify Storybook Docs pages and interactive controls in the browser and production build

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
