# Component Documentation Authoring Guide

Axis component documentation is written in MDX and colocated with the component's stories. The complete Docs page is the component guideline; do not add a separate Guidelines section.

Start from `packages/ui/src/components/.template.mdx`, copy it into the component folder, and replace the placeholder imports and content. Name the file after the component, for example `Button.mdx`.

## Standard Structure

Use these sections in this order:

1. Overview
2. Usage
3. Variants
4. API
5. Accessibility

Add a specialized section only when the component genuinely needs it. Keep guidance concise and focused on design decisions rather than documenting every implementation state.

## Story And MDX Setup

- Keep stories and MDX beside the component implementation.
- Attach the MDX page to its story metadata with `<Meta of={Stories} />`.
- Remove `autodocs` from the story metadata after adding a custom MDX page. This prevents duplicate Docs entries.
- Keep individual stories in the sidebar for development.
- Add grouped documentation stories for option families such as variants, sizes, and states. Embed those grouped stories in the Docs page instead of rendering every option in a separate Canvas.
- Add `tags: ['!dev']` to grouped documentation stories so they remain available to MDX but do not appear as standalone sidebar entries.
- Use Storybook Doc Blocks so examples remain interactive and API tables remain generated from Vue metadata.
- Do not document Vue framework attributes such as `key`, `ref`, `ref_for`, or `ref_key` as component props. Generic `class` and `style` fall through to component roots but are also excluded globally because they are not component-owned API.

## Overview

Write one short paragraph that explains the component's purpose and the kind of task it supports. Do not list variants, props, or implementation details here.

Example:

> Button communicates an action that a user can take and gives that action an appropriate level of emphasis.

## Common Example

Immediately after the Overview paragraph, show one interactive `Canvas` using the most common configuration. Do not add a heading for this example. It should help a reader understand the component before they encounter detailed options.

```mdx
<Canvas of={Stories.Playground} />
```

## Usage

Start with a short Vue import and usage example showing the most common component configuration. Follow it with three to five short best-practice bullets for broad principles. Use a bold lead-in so each recommendation is easy to scan, followed by one or two sentences of explanation.

Follow the bullets with a compact, two-column **Use / Avoid** table containing two or three concrete comparisons. Do not repeat every bullet in the table. Bullets explain principles; the table contrasts specific good and bad examples.

Translate relevant Material Design principles into concise Axis-specific guidance rather than quoting Material documentation.

````mdx
```vue
<script setup lang="ts">
import { Button } from '@vinodkola/axis-ui'
</script>

<template>
  <Button label="Save changes" />
</template>
```

- **Label actions clearly:** Use concise, action-oriented text in sentence case.
- **Establish a clear hierarchy:** Reserve the highest emphasis for the main next step.
````

The docs host enables GitHub-Flavored Markdown through `remark-gfm`, so use concise pipe tables in component MDX:

```mdx
| Use | Avoid |
|---|---|
| Use a clear, action-oriented label. | Avoid vague labels such as "Click here." |
```

## Variants

Group related options in one comparison Canvas, followed by a compact decision table. Introduce each option family with one sentence naming the prop that controls it and explaining what the prop changes.

```mdx
### Emphasis

The `emphasis` prop controls the button's visual prominence.

<Canvas of={Stories.Emphases} />

| Emphasis | Use when |
|---|---|
| Filled | The action is the main next step in a focused area. |
| Outlined | The action supports the main action and still needs clear affordance. |
```

Give each option family a descriptive `h3` heading, such as Severity, Sizes, or States. Use one grouped Canvas and one decision table per option family. Document disabled under Variants when the component supports it, with a one-line prop description and a disabled Canvas. Although disabled is an interaction state rather than a visual style variant, keeping it here makes the component's available configurations easier to discover.

Grouped comparison stories are documentation helpers rather than isolated component states. Hide them from the development sidebar with the built-in `!dev` tag:

```ts
export const Severities: Story = {
  tags: ['!dev'],
  render: () => ({
    // Render the grouped comparison used by the MDX Canvas.
  }),
}
```

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
