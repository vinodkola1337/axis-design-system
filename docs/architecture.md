# Axis Design System — Architecture

## Overview

Axis DS is a token-driven, multi-theme design system built as a pnpm monorepo. Tokens are the single source of truth — every visual decision flows from them. Components are split between from-scratch (form elements) and PrimeVue unstyled (complex interactive components). Storybook serves as the living documentation layer.

---

## Big Picture

```mermaid
flowchart TD
    subgraph Design["Design Layer"]
        Figma["Figma + PrimeVue UI Kit"]
        TS["Tokens Studio plugin"]
        Figma --> TS
    end

    subgraph PkgTokens["packages/tokens — @vinodkola/axis-tokens"]
        JSON["tokens.json"]
        SD["Style Dictionary"]
        CSSOUT["dist/tokens.css"]
        JSOUT["dist/index.js"]
        JSON --> SD
        SD --> CSSOUT
        SD --> JSOUT
    end

    subgraph PkgUI["packages/ui — @vinodkola/axis-ui"]
        TW["Tailwind v4"]
        Scratch["From-scratch components<br/>Button, TextInput, Select, Checkbox"]
        PVU["PrimeVue unstyled<br/>Table, DatePicker, Dialog"]
        TW --> Scratch
        TW --> PVU
    end

    subgraph PkgDocs["packages/docs — @axis/docs"]
        SB["Storybook 10"]
    end

    subgraph Consumers["Consuming Applications"]
        AppA["Product A — Default Theme"]
        AppB["Product B — Brand X Theme"]
    end

    TS -->|"sync to repo"| JSON
    CSSOUT -->|"CSS custom properties"| TW
    PkgTokens -->|"@vinodkola/axis-tokens"| PkgDocs
    PkgUI -->|"@vinodkola/axis-ui"| PkgDocs
    PkgTokens -->|"@vinodkola/axis-tokens"| Consumers
    PkgUI -->|"@vinodkola/axis-ui"| Consumers
```

---

## Monorepo Structure

```
axis-design-system/
├── pnpm-workspace.yaml          ← defines workspace packages
├── package.json                 ← root scripts, shared dev dependencies
├── packages/
│   ├── tokens/                  ← @vinodkola/axis-tokens
│   │   ├── package.json
│   │   ├── style-dictionary.config.js
│   │   ├── tokens/
│   │   │   ├── primitive.json   ← raw values (colors, spacing, type scale)
│   │   │   ├── semantic.json    ← purpose-mapped aliases (background, text, border)
│   │   │   └── component.json  ← component-level tokens (button-height, text-input-radius)
│   │   └── dist/
│   │       ├── tokens.css       ← CSS custom properties (output)
│   │       └── index.js         ← JS/TS exports (output)
│   │
│   ├── ui/                      ← @vinodkola/axis-ui
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── components/      ← per-component folders (button, text-input, table, dialog...)
│   │       ├── styles/
│   │       │   └── main.css     ← Tailwind v4 entry + @theme inline token mapping
│   │       └── index.ts         ← barrel export (also imports main.css)
│   │
│   └── docs/                    ← @axis/docs
│       ├── package.json
│       └── .storybook/
│
└── docs/                        ← non-code documentation (this file)
    ├── architecture.md
    └── learning/
```

---

## Token Pipeline

Tokens flow in one direction: design tool → source JSON → built artifacts → components.

```mermaid
flowchart LR
    A["Figma + Tokens Studio"] -->|"sync"| B["tokens.json"]
    B -->|"pnpm tokens:build"| C["Style Dictionary"]
    C --> D["tokens.css<br/>CSS custom properties"]
    C --> E["index.js<br/>JS constants"]
    D -->|"imported by"| F["@vinodkola/axis-ui components"]
    E -->|"imported by"| F
    D -->|"installed by"| G["Consumer apps"]
    E -->|"installed by"| G
```

Style Dictionary runs as a build step — locally on demand, and in CI on every push to `main`. The generated `dist/` is gitignored; token change diffs are visible in the source JSON files.

---

## Three-Tier Token Model

```mermaid
flowchart LR
    subgraph P["① Primitive"]
        P1["color-blue-500<br/>#3B82F6"]
        P2["color-blue-700<br/>#1D4ED8"]
        P3["spacing-4<br/>1rem"]
        P4["radius-md<br/>0.375rem"]
    end

    subgraph S["② Semantic"]
        S1["color-action-primary<br/>{color-blue-500}"]
        S2["color-action-primary-hover<br/>{color-blue-700}"]
        S3["color-text-default<br/>{color-gray-900}"]
        S4["color-surface-page<br/>{color-white}"]
    end

    subgraph C["③ Component"]
        C1["button-bg<br/>{color-action-primary}"]
        C2["button-bg-hover<br/>{color-action-primary-hover}"]
        C3["button-radius<br/>{radius-md}"]
    end

    P --> S --> C
```

**The rule:** components only reference component or semantic tokens, never primitives directly. This ensures a single primitive change cascades everywhere automatically.

---

## Dark / Light Mode

Mode switching is handled by `useColorMode()` from VueUse. It respects the OS preference by default and allows user override.

```mermaid
flowchart TD
    OS["OS preference<br/>prefers-color-scheme"]
    Toggle["User toggle in app UI"]
    UCM["useColorMode()<br/>VueUse composable"]
    HTML["html class attribute<br/>light or dark"]

    subgraph CSS["Token overrides in tokens.css"]
        Light[":root — light token values"]
        Dark[".dark — dark token overrides"]
    end

    OS --> UCM
    Toggle --> UCM
    UCM --> HTML
    HTML --> CSS
```

Only **semantic tokens** are overridden per theme. Primitive tokens never change. This means adding a new theme is just a new set of semantic token overrides — no component code changes.

---

## Component Strategy

All components live in per-component folders under `src/components/` — no atomic hierarchy. Components are grouped by public component name, with each folder owning its Vue implementation, local exports, and future component-specific files.

| From scratch | PrimeVue unstyled |
|---|---|
| Button, TextInput, Select, Checkbox, Radio, Switch, Textarea, Label | Table, DatePicker, Dialog, Dropdown, Toast, Tabs |

PrimeVue unstyled mode provides accessibility, keyboard navigation, and ARIA for complex components. Axis owns 100% of the visual layer for both groups.

**Decision:** Per-component folders were chosen over atomic (atoms/molecules/organisms) because the atom/molecule boundary is subjective and causes maintenance friction as a system grows. Consumers look for components by name, not composition depth.

---

## Component CSS Class Naming

Axis component styles use a BEM-style class naming convention with an `axis-` namespace:

```css
.axis-text-input {}
.axis-text-input__control {}
.axis-text-input--invalid {}
```

- **Block:** the standalone component root, such as `axis-text-input`.
- **Element:** an internal part of the component, separated with `__`, such as `axis-text-input__control`.
- **Modifier:** a variant or state, separated with `--`, such as `axis-text-input--invalid`, `axis-text-input--fluid`, or `axis-text-input--sm`.

This keeps component CSS readable, scoped by convention, and predictable without relying on vague global names like `.input`, `.error`, or `.large`. The `axis-` prefix avoids collisions with consumer application styles.

This convention is separate from CSS custom properties. Token variables such as `--axis-text-input-color-bg` also start with `--`, but that is required CSS syntax for custom properties, not BEM.

---

## Tailwind v4 + Token Integration

Tailwind v4 uses CSS-first configuration — no `tailwind.config.js`. The integration with axis-tokens is done in `src/styles/main.css` via two directives:

```css
@theme {
  --color-*: initial;       /* reset Tailwind's default color palette */
}

@theme inline {
  --color-interactive: var(--axis-color-interactive-primary);
  --color-text: var(--axis-color-text-primary);
  /* ... all semantic tokens mapped */
}
```

**`@theme` (without `inline`)** — resets Tailwind's built-in colors. This enforces that developers can only use axis semantic token names as utility classes (`bg-interactive`, `text-text-secondary`), not Tailwind's default palette (`bg-blue-500`).

**`@theme inline`** — maps axis CSS vars to Tailwind's utility namespace without resolving the values at build time. The `var()` references are kept as-is in the output. At runtime the browser resolves them against whatever `tokens.css` defines on `:root`.

**CSS output split:** `dist/style.css` (built by Vite) contains Tailwind utilities. `dist/tokens.css` (from packages/tokens) contains the CSS custom property values. Consumers must import both — the UI CSS depends on the token vars being present in the document.

**Tree-shaking:** Tailwind v4 only emits a utility class if it's actually used in the source files scanned by the Vite plugin. An unused `bg-error` never appears in the output bundle.

---

## Package Export Strategy

`@vinodkola/axis-ui` supports two import styles. Both are valid, both are tree-shaken.

```ts
// Named import — bundler tree-shakes unused components
import { Button, TextInput } from '@vinodkola/axis-ui'

// Subpath import — explicit, zero risk of side-effect imports
import Button from '@vinodkola/axis-ui/button'
import TextInput from '@vinodkola/axis-ui/text-input'
```

Subpath exports are defined in `packages/ui/package.json` under the `exports` field.

---

## Deployment

### npm Public Registry — Packages

`@vinodkola/axis-tokens` and `@vinodkola/axis-ui` are published publicly on npmjs.com. Each package requires:

```json
{
  "publishConfig": { "access": "public" },
  "files": ["dist"]
}
```

`publishConfig` is required — scoped packages default to private without it. `files` ensures only `dist/` is shipped, not source, config, or stories.

```
pnpm --filter @vinodkola/axis-tokens publish
pnpm --filter @vinodkola/axis-ui publish
```

### Vercel — Storybook

`packages/docs` builds to a static site and is hosted on Vercel's free plan. Since Storybook depends on `@vinodkola/axis-ui` and `@vinodkola/axis-tokens` being built first, Vercel runs from the repo root.

| Setting | Value |
|---|---|
| Root directory | `/` |
| Build command | `pnpm run tokens:build && pnpm --filter @vinodkola/axis-ui build && pnpm --filter @axis/docs build-storybook` |
| Output directory | `packages/docs/storybook-static` |
| Install command | `pnpm install` |

Every branch gets a preview deployment URL automatically — useful for reviewing component changes before merging to `main`.

---

## Design Guidelines

Axis DS follows **Material Design 3 (MD3)** as its primary design guideline reference. This is a *principles* decision, not a components decision — we don't use Google's Material components; we use MD3's documented thinking on color roles, elevation, motion, typography, and accessibility as the foundation for our own decisions.

**Why MD3:**
- The most detailed, publicly documented design system spec available
- Color role model (`surface`, `on-surface`, `primary`, `on-primary`…) maps closely to the three-tier token model already in use
- Covers accessibility, motion, and component behavior — areas most in-house systems leave undocumented

**What we follow from MD3:**
- Color role naming and relationships (adapted to our `color.background`, `color.surface`, `color.text` naming)
- Elevation model — shadows and surface layering
- Typography scale and role assignments (display, headline, body, label)
- Component interaction states (hover, pressed, focused, disabled) and their token formulas
- Accessibility contrast ratios (minimum 4.5:1 for text, 3:1 for UI elements)

**What we diverge from:**
- MD3 uses its own naming convention (`colorScheme.primary`, `colorScheme.onPrimary`); Axis uses a more readable noun-based naming (`color.interactive.primary`, `color.text.inverse`)
- MD3 targets Material You / adaptive theming; Axis targets product design systems with explicit theme files

**Alternatives considered:**

| System | Strength | Why not primary reference |
|---|---|---|
| Material Design 3 | Most complete spec, color roles, motion | ✓ Chosen |
| Apple HIG | Native Apple UX patterns | Web-focused, less applicable |
| Fluent Design (Microsoft) | Enterprise, Windows ecosystem | Less community tooling |
| Atlassian Design System | Practical enterprise patterns | Proprietary, product-specific |
| Carbon (IBM) | Accessibility-first, data-heavy UIs | Data-product bias |

---

## How Consumers Install Axis DS

```ts
// Install
// pnpm add @vinodkola/axis-tokens @vinodkola/axis-ui

// In app entry (main.ts)
import '@vinodkola/axis-tokens/dist/tokens.css'   // 1. CSS custom property values (:root)
import '@vinodkola/axis-ui/style.css'             // 2. Tailwind utilities + component styles

// Per component
import { Button } from '@vinodkola/axis-ui'
```

Order matters: tokens.css must load first. The UI style.css references `var(--axis-*)` — those vars must be defined before the utilities are applied.

For multi-theme consumers: load the appropriate theme override file after the base tokens.

```ts
import '@vinodkola/axis-tokens/dist/tokens.css'         // base (light)
import '@vinodkola/axis-tokens/dist/theme-brandx.css'   // override semantic tokens
```
