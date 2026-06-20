# Packages And Releases Architecture

## Package Exports

The public packages support named imports, and the UI package also exposes component subpaths. Storybook consumes workspace source but remains outside the published UI package.

```ts
import { Button, TextInput } from '@vinodkola/axis-ui'
import Button from '@vinodkola/axis-ui/button'
```

## Consumer Styles

Consumers load package styles in this order:

```ts
import '@vinodkola/axis-tokens/dist/tokens.css'
import '@vinodkola/axis-ui/base.css' // optional application defaults
import '@vinodkola/axis-ui/style.css'
```

Token CSS loads first because UI styles reference `var(--axis-*)` values.

## Publishing

Both public packages publish only their `dist` directories with public npm access. Storybook is deployed as a static site; deployment status and remaining release work are tracked in `docs/spec.md`.

## Versioning

- `@vinodkola/axis-tokens` and `@vinodkola/axis-ui` use fixed, synchronized versions.
- Changesets manages public package versions and changelogs before the first npm release.
- The private `@axis/docs` package is versioned separately from the public packages.
