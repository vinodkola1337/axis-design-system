# Design Tokens

## Token Toolchain — Specify is Dead, Here's What Replaced It

**Specify** has pivoted away from its original purpose and is no longer the standard. The current market-standard free pipeline:

### The Pipeline

```
Figma  →  Tokens Studio (plugin)  →  GitHub (tokens.json)
                                           ↓
                                  Style Dictionary (build step)
                                           ↓
                         CSS custom properties / JS/TS exports
                                           ↓
                               Axis DS components consume them
```

### Tools

**Tokens Studio** — Figma plugin. Edit tokens visually inside Figma, sync directly to a GitHub repo as JSON.
- https://tokens.studio

**Style Dictionary** — Amazon open-source build tool. Transforms raw token JSON into any output format: CSS custom properties, JS/TS constants, SCSS, Swift, Android XML. One source, many targets. Used by IBM Carbon, Salesforce Lightning, Adobe Spectrum.
- https://styledictionary.com

---

## CSS Custom Properties vs SCSS Variables

**SCSS variables are compile-time. CSS custom properties are runtime.** That distinction decides everything for tokens.

```scss
/* SCSS var — baked in at build, gone at runtime */
$color-primary: #3B82F6;
.button { background: $color-primary; }
/* compiles to → background: #3B82F6; (literal, no trace of the var) */

/* CSS custom property — lives in the browser */
:root { --color-primary: #3B82F6; }
.button { background: var(--color-primary); }
/* JS can change it, media queries can override it,
   a component can locally scope it without touching globals */
```

CSS custom properties enable:
- **Dark mode** — override `:root` vars under `prefers-color-scheme: dark`
- **Runtime theming** — JS swaps values without a rebuild
- **Component-level scoping** — set `--color-primary` inside `.card {}` to override locally

---

## How Style Dictionary Works Internally

Three steps happen in sequence every build:

**1. Read** — loads all token JSON files and merges them into one token tree.

**2. Resolve references** — `{color.gray.50}` is replaced with the referenced token's value. With `outputReferences: true` in the CSS platform, references are kept as `var()` chains instead of resolving to literals:

```css
/* outputReferences: false (default) — resolved to literal */
--axis-color-background-default: #f8fafc;

/* outputReferences: true — kept as var() chain */
--axis-color-background-default: var(--axis-color-gray-50);
```

The `var()` form is better for theming — overriding `--axis-color-gray-50` at runtime cascades to everything that references it.

**3. Transform + format** — applies transforms per platform, then writes files. Transforms convert raw token values into platform-appropriate formats:

| Transform | Input | Output |
|---|---|---|
| `px` → `rem` | `16px` | `1rem` |
| color to hex | `rgb(59,130,246)` | `#3b82f6` |
| name to camelCase | `color.blue.500` | `ColorBlue500` |
| name to kebab-case | `color.blue.500` | `color-blue-500` |

Each `transformGroup` (e.g. `'css'`, `'js'`) is a preset bundle of these transforms.

**Multi-platform output — one source, many targets:**

```
tokens/primitive.json + semantic.json + component.json
                    ↓
            Style Dictionary
                    ↓
┌──────────────────────────────────────────────────┐
│ dist/tokens.css    CSS custom properties  (web)  │
│ dist/index.js      JS named exports       (web)  │
│ dist/tokens.swift  UIColor constants      (iOS)  │
│ dist/tokens.xml    color resources      (Android)│
└──────────────────────────────────────────────────┘
```

Axis DS only uses CSS + JS today, but the architecture supports adding iOS/Android output with no changes to the token source files.

---

## Style Dictionary in CI/CD

Style Dictionary is a **pure file transformer** — deterministic, no network, no side effects. Same input always produces identical output. Risk is the same as running `tsc`.

### Two patterns

| Pattern | Commit generated files? | When to use |
|---------|------------------------|-------------|
| Commit output | Yes — CSS/JS in the repo | Reviewers see token diffs in PRs without running the build |
| Build-only | No — gitignored, generated at CI | Cleaner repo, artifacts live in the pipeline |

For Axis DS: **build-only** (gitignored). Token diffs are visible in the source JSON files — that's where the real change is. Generated CSS is noise in a PR.

### Where it sits in a pipeline

```
git push → CI → npm run tokens:build → Style Dictionary transforms
→ CSS/JS output → rest of build → tests → publish
```

No special approval needed for the tool. The review happens on the `tokens.json` change that triggered it — normal PR process.

---

## Why Tokens Matter Architecturally

The test of a well-architected DS:

> If a designer changes `color-brand-primary` in Figma, does it propagate automatically to every component without touching component files?

- **Yes** → well-architected
- **No, you grep through component files** → not architected, just styled

---

## The Three-Tier Token System (industry standard)

```
Primitive tokens    →  Semantic tokens        →  Component tokens
color-blue-500         color-action-primary      button-bg-default
spacing-4              spacing-component-md      button-padding-x
font-size-14           font-size-body            input-label-size
```

### Primitive tokens
Raw values, no meaning. Think of these as your palette — they just exist.
```json
{ "color-blue-500": "#3B82F6", "color-blue-700": "#1D4ED8" }
```

### Semantic tokens
Meaning attached. They reference primitives and answer "what is this used for?" — not "what value is it?"
```json
{
  "color-action-primary":     { "value": "{color-blue-500}" },
  "color-action-primary-hover": { "value": "{color-blue-700}" },
  "color-text-default":       { "value": "{color-gray-900}" },
  "color-text-muted":         { "value": "{color-gray-500}" },
  "color-surface-page":       { "value": "{color-white}" },
  "color-surface-card":       { "value": "{color-gray-50}" }
}
```

Dark mode works by **only overriding semantic tokens**, not primitives:
```json
/* dark theme overrides */
{
  "color-text-default":   { "value": "{color-gray-100}" },
  "color-surface-page":   { "value": "{color-gray-950}" }
}
```
`color-blue-500` never changes. Only what it means in context changes.

### Component tokens
Map semantic tokens to specific component slots. Optional but useful for complex components.
```json
{
  "button-bg-default":    { "value": "{color-action-primary}" },
  "button-bg-hover":      { "value": "{color-action-primary-hover}" },
  "button-text":          { "value": "{color-white}" },
  "button-padding-x":     { "value": "{spacing-4}" }
}
```

This is how changes cascade: update one primitive → semantic tokens referencing it update → component tokens update → all components update. Zero component file changes.

**Further reading:** https://css-tricks.com/what-are-design-tokens
