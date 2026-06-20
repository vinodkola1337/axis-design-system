# Tokens And Theming Architecture

## Token Flow

Tokens flow in one direction:

```text
Figma / Tokens Studio -> token JSON -> Style Dictionary -> CSS and JavaScript -> UI and consumers
```

The source files under `packages/tokens/tokens` use three tiers:

1. **Primitive:** raw palette, spacing, typography, radius, and border values.
2. **Semantic:** purpose-based roles such as text, surface, border, interaction, and feedback.
3. **Component:** component-specific decisions that reference semantic tokens.

Components may reference semantic or component tokens. They must not reference primitives directly or introduce hardcoded visual values.

Style Dictionary generates CSS custom properties, JavaScript values, and TypeScript declarations in `packages/tokens/dist`. Generated output is build output and is not committed.

## Theming

Theme differences are expressed by overriding semantic tokens. Primitive values remain stable, and components require no theme-specific implementation changes.

The dark-theme selector and application-level preference mechanism are implementation decisions for the theming roadmap item. They must preserve this semantic-override boundary.

## Tailwind Integration

Tailwind v4 is configured through CSS in `packages/ui/src/styles/main.css`.

- The default Tailwind color palette is reset so product code cannot bypass Axis color roles.
- `@theme inline` maps Axis semantic custom properties into Tailwind utility namespaces without resolving their values at build time.
- Component styles and utilities are distributed as `style.css`.
- Optional application-level typography defaults and type-role classes are distributed separately as `base.css` to avoid automatic global side effects.

Consumers must load token CSS before UI CSS because UI styles reference `var(--axis-*)` values.
