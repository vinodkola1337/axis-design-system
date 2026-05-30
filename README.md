# Axis Design System

A token-driven, scalable UI system that aligns design, components, and application architecture into a single source of truth.

---

## Packages

| Package | Description |
|---|---|
| `@vinodkola/axis-tokens` | Design tokens as CSS custom properties and JS constants |
| `@vinodkola/axis-ui` | Vue 3 component library styled with axis tokens |

---

## Installation

```bash
npm install @vinodkola/axis-tokens @vinodkola/axis-ui
```

---

## Setup

Two CSS files must be imported in your app entry point (`main.ts`), **in this order**:

```ts
import '@vinodkola/axis-tokens/dist/tokens.css'  // 1. token values
import '@vinodkola/axis-ui/style.css'             // 2. component styles
```

**Why order matters:** `axis-ui/style.css` contains CSS rules that reference token variables — for example, `.bg-interactive { background-color: var(--axis-color-interactive-primary) }`. Those variables are defined by `tokens.css`. If `tokens.css` hasn't loaded yet when the browser applies the component styles, every token-backed value renders as its unset fallback (usually transparent or invisible). Loading tokens first guarantees the variables exist before anything tries to use them.

Then import and use components:

```ts
import { Button } from '@vinodkola/axis-ui'
```

---

## Peer dependencies

`@vinodkola/axis-ui` requires Vue 3 as a peer dependency — it is not bundled. Your app is expected to have Vue installed already.

```bash
npm install vue
```

Tailwind CSS is **not** a peer dependency. It is a build-time tool used internally to generate `axis-ui/style.css`. Consumers receive pre-compiled plain CSS — no Tailwind installation required.

---

## Theming

Axis supports multiple themes via token overrides. Load the base tokens first, then a theme file to override the semantic layer:

```ts
import '@vinodkola/axis-tokens/dist/tokens.css'         // base (light)
import '@vinodkola/axis-tokens/dist/theme-dark.css'     // dark mode overrides
import '@vinodkola/axis-ui/style.css'
```

Only semantic tokens are overridden per theme — component code never changes.
