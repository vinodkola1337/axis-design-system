# Axis Design System

Axis is a token-driven Vue 3 design system that keeps design decisions, reusable components, and documentation aligned through shared tokens.

> Axis is currently pre-release. Public npm publication is tracked in `docs/spec.md`.

## Packages

| Package | Responsibility | Publication |
|---|---|---|
| `@vinodkola/axis-tokens` | Design tokens as CSS custom properties, JavaScript values, and TypeScript declarations | Public after first release |
| `@vinodkola/axis-ui` | Vue components and shared styles | Public after first release |
| `@axis/docs` | Storybook documentation and browser tests | Private |

## Local Development

```bash
pnpm install
pnpm run storybook
```

Useful commands:

```bash
pnpm run tokens:build     # Build token outputs
pnpm run build            # Build tokens and UI packages
pnpm run storybook:build  # Build the static Storybook site
pnpm run storybook:test   # Run Storybook browser tests
```

## Consumer Setup

After the first public release, applications will install the public packages together:

```bash
pnpm add @vinodkola/axis-tokens @vinodkola/axis-ui
```

Load token values before component styles. Application-level typography defaults are optional.

```ts
import '@vinodkola/axis-tokens/dist/tokens.css'
import '@vinodkola/axis-ui/base.css' // optional
import '@vinodkola/axis-ui/style.css'

import { Button } from '@vinodkola/axis-ui'
```

`@vinodkola/axis-ui` requires Vue 3 as a peer dependency. Consumers receive compiled CSS and do not need to install Tailwind CSS.

Dark-theme assets are not yet published. Theme implementation progress is tracked in the project status document.

## Documentation

- [Project status](docs/spec.md)
- [Architecture overview](docs/architecture/overview.md)
- [Component documentation guide](docs/component-documentation.md)
