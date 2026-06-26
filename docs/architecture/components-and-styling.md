# Components And Styling Architecture

## Component Ownership

Components live in folders named after their public component under `packages/ui/src/components`. Each folder owns its implementation, exports, stories, documentation, tests, and component-specific support files.

Axis does not use an atoms/molecules/organisms directory hierarchy. Those boundaries become subjective as components evolve; consumers and maintainers locate components by public name.

## Implementation Strategy

- Build form controls and other foundational elements from scratch so Axis owns their public API, semantics, and behavior.
- Build Dialog natively so Axis owns its controlled API, focus behavior, modal semantics, and tokenized MD3 surface treatment.
- Use PrimeVue in unstyled mode for complex interaction patterns when its accessibility and keyboard behavior reduce meaningful implementation risk.
- Axis owns the visual layer in both cases through tokens and component styles.

## CSS Conventions

Component CSS uses an `axis-` namespace and BEM-style names:

```css
.axis-text-input {}
.axis-text-input__control {}
.axis-text-input--invalid {}
```

Use block names for component roots, `__` for internal elements, and `--` for variants or states. CSS custom properties also begin with `--`, but that is CSS syntax rather than BEM.

## Adaptive Layout

- Prefer adaptive, container-aware sizing over hardcoded dimensions or browser defaults.
- Components may fill their parent when that is the common Material-aligned behavior. Parent layouts own page-level max-widths, margins, and grids.
- Expose layout props only for reusable component decisions, such as `fluid`.
- Prefer persistent, accessible labels and state communication. Floating labels are acceptable only when the label remains available.
- Text fields are generally fluid in forms. Non-fluid text fields use tokenized minimum, default, and maximum widths.

## Icons

Lucide is the product icon source, exposed through the Axis `Icon` component. Lucide owns SVG paths; Axis owns sizing, stroke, color, and accessibility treatment through tokens and component behavior.

Product code passes imported Lucide components directly instead of using a string registry. This keeps imports tree-shakable and avoids maintaining a registry before the icon vocabulary stabilizes.

Icons inherit `currentColor` by default. Semantic color aliases are reserved for standalone status or emphasis. PrimeIcons may be used internally when a PrimeVue component requires them, but public Axis examples use Lucide for consistency.

Detailed usage and accessibility guidance lives in the Storybook `Styles/Icons` documentation.

## Design Principles

Axis follows Material Design 3 principles for color roles, typography, interaction states, adaptive layout, and accessibility without adopting Material components or naming wholesale.

Axis uses purpose-oriented names such as `color.interactive.primary` and explicit theme files rather than Material's `colorScheme` naming and adaptive Material You model. Record additional intentional divergences here when they affect the system broadly.

Accessibility targets WCAG 2.2 AA. Text requires at least 4.5:1 contrast and meaningful UI boundaries require at least 3:1 contrast, subject to the applicable WCAG criterion.
