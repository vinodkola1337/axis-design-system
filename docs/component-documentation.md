# Component Documentation Authoring Guide

Axis component documentation is written in MDX and colocated with the component's stories. The complete Docs page is the component guideline; do not add a separate Guidelines section.

Start from `packages/ui/src/components/.template.mdx`, copy it into the component folder, and replace the placeholder imports and content. Name the file after the component, for example `Button.mdx`.

## Standard Structure

Use these sections in this order:

1. Overview
2. Simple Example
3. Usage
4. Variants
5. API
6. Accessibility

Add a specialized section only when the component genuinely needs it. Keep guidance concise and focused on design decisions rather than documenting every implementation state.

## Story And MDX Setup

- Keep stories and MDX beside the component implementation.
- Attach the MDX page to its story metadata with `<Meta of={Stories} />`.
- Remove `autodocs` from the story metadata after adding a custom MDX page. This prevents duplicate Docs entries.
- Keep individual stories in the sidebar for development.
- Add grouped documentation stories for option families such as variants, sizes, and states. Embed those grouped stories in the Docs page instead of rendering every option in a separate Canvas.
- Use Storybook Doc Blocks so examples remain interactive and API tables remain generated from Vue metadata.

## Overview

Write one short paragraph that explains the component's purpose and the kind of task it supports. Do not list variants, props, or implementation details here.

Example:

> Button communicates an action that a user can take and gives that action an appropriate level of emphasis.

## Simple Example

Show one interactive `Canvas` using the most common configuration. The example should help a reader understand the component before they encounter detailed options.

```mdx
<Canvas of={Stories.Primary} />
```

## Usage

Provide one high-level, two-column **Use / Avoid** table with two to five guidelines. Translate relevant Material Design principles into concise Axis-specific guidance rather than quoting Material documentation.

| Use | Avoid |
|---|---|
| Use a clear, action-oriented label. | Avoid vague labels such as "Click here." |
| Use one primary action in a focused area. | Avoid giving several nearby actions equal emphasis. |

## Variants

Group related options in one comparison Canvas, followed by a compact decision table.

```mdx
<Canvas of={Stories.Variants} />
```

| Variant | Use when |
|---|---|
| Primary | The action is the main next step. |
| Secondary | The action supports the primary action. |
| Ghost | The action needs low visual emphasis. |
| Danger | The action is destructive or difficult to reverse. |

Use one grouped Canvas per option family, such as variants, sizes, or states. Add a one-sentence recommendation only when an option represents a meaningful design decision. Self-explanatory implementation states do not need separate guidance.

The `danger` row above is a documentation example, not part of the Button API until that variant is implemented.

## API

Render generated API information with `ArgTypes`. Props, slots, and emitted events should come from Vue component metadata rather than hand-maintained Markdown tables.

```mdx
<ArgTypes />
```

Keep component types and story metadata accurate so the generated tables remain the source of truth.

## Accessibility

Always include **Screen Reader** and **Keyboard Support** subsections.

Under **Screen Reader**, explain labeling, accessible names, announcements, and relevant relationships. Include a short example when the correct labeling pattern is not obvious.

Under **Keyboard Support**, provide a key/function table when the component has keyboard interactions.

| Key | Function |
|---|---|
| `Enter` | Activates the focused button. |
| `Space` | Activates the focused button. |

State when a native element supplies expected keyboard behavior. For complex interactive components, document the behavior provided by PrimeVue and any Axis-specific additions.

## Navigation And Release History

The global Storybook table of contents reads `h2` and `h3` headings, so Usage, Variants, API, Accessibility, and accessibility subsections appear automatically.

Do not add component-level version history. Package changes belong in the future package changelog and standalone Release Notes page.
