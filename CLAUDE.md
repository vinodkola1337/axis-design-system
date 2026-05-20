# Axis Design System

Token-driven, scalable UI system. Single source of truth for design and engineering.

## Stack

- Vue 3 + TypeScript
- Storybook 8
- Tailwind CSS
- Style Dictionary (token transforms)
- Tokens Studio (Figma plugin, token editing)

## Architecture

Full architecture with diagrams → `docs/architecture.md`

Key decisions:
- Tokens are the single source of truth. Components never hardcode values.
- Three-tier tokens: Primitive → Semantic → Component. Components reference semantic, never primitive.
- Dark/light mode via semantic token overrides only. No component changes needed per theme.
- Components: from scratch for form elements, PrimeVue unstyled for complex interactive components.
- Package export: named imports + subpath exports both supported.
- npm scope: `@vinodkola/axis-tokens` and `@vinodkola/axis-ui` — published publicly on npmjs.com.
- Storybook hosted on Vercel free plan.

## Conventions

_To be filled as the system is built._
