# Component Documentation Authoring Guide

Use this guide when creating or changing component stories, MDX pages, Controls, API tables, or accessibility documentation.

Start from `packages/ui/src/components/.template.mdx`, copy it into the component folder, and replace its placeholders. Name the MDX file after the component, such as `Button.mdx`.

Use `Button.mdx` and `Button.stories.ts` as the canonical reference when the template or this guide does not show enough detail.

## Required Page Structure

Use these sections in order:

1. Overview
2. Usage
3. Variants
4. API
5. Accessibility

The Docs page is the complete component guideline; do not add a separate Guidelines section. Add another section only when the component genuinely needs it.

## Story And MDX Setup

- Keep the component, stories, and MDX in the same component folder.
- Attach MDX to its story metadata with `<Meta of={Stories} />`.
- Remove `autodocs` after adding custom MDX to prevent duplicate Docs entries.
- Expose one sidebar story named `Playground`. It is the component's interactive workbench and supports every meaningful public prop through Controls.
- Use `Playground` as the first Canvas after the Overview paragraph.
- Treat every other story as a documentation or test helper. Mark it with `tags: ['!dev']` so it can be embedded in MDX without appearing in the sidebar.
- Create grouped helper stories for option families such as variants, sizes, and states. Do not create a visible standalone story for every prop value.
- Give helper stories a focused render and, when Storybook's generated source is noisy, a concise `parameters.docs.source.code` example that shows the intended consumer API.
- Use Storybook Doc Blocks for interactive examples and generated API tables.

## Overview

Write one short paragraph explaining the component's purpose and the task it supports. Do not list props, variants, or implementation details.

Immediately after the paragraph, render the most common configuration without adding another heading:

```mdx
<Canvas of={Stories.Playground} />
```

## Usage

Include a short Vue import and usage example for the common configuration. Then add:

- Three to five concise recommendations with bold lead-ins.
- A reason tied to user outcomes, hierarchy, consistency, or accessibility.
- A two-column **Use / Avoid** table with two or three concrete comparisons.

Do not repeat every recommendation in the table. Translate relevant Material Design principles into Axis-specific guidance rather than quoting Material documentation.

The docs host supports GitHub-Flavored Markdown, so use pipe tables instead of verbose HTML tables.

## Variants

For each option family:

1. Add a descriptive `h3` heading such as Emphasis, Severity, Sizes, or States.
2. Name the controlling prop and explain what it changes in one sentence.
3. Show one grouped comparison Canvas.
4. Add a compact decision table explaining when to use each option.

Document a supported disabled state here with its controlling prop and Canvas. Although disabled is an interaction state, placing it under Variants makes the available configurations discoverable.

## API Documentation

Render API metadata with Storybook's `ArgTypes` block:

```mdx
<ArgTypes />
```

Props, slots, and emitted events come from Vue component metadata rather than hand-maintained Markdown tables.

### Props And Controls

- Define component defaults in metadata `args` so `Playground` opens in the common configuration.
- Use typed story `args` and `argTypes` for every meaningful public component prop supported by `Playground`.
- Bind controlled args and Action handlers explicitly in the metadata render function so Playground changes are reflected by the component.
- Choose a sensible control type and define `options` for constrained values.
- Use `mapping` when a friendly control value must resolve to a complex runtime value, such as a Vue icon component.
- Document descriptions and defaults consistently with the component's runtime API.
- Disable Controls for values that are not meaningfully editable in Storybook.
- Exclude Vue framework metadata such as `key`, `ref`, `ref_for`, and `ref_key`. Generic `class` and `style` are fallthrough attributes, not component-owned props, and are excluded globally.

### Events And Actions

- Document canonical Vue event names such as `click`, `focus`, `blur`, and `update:modelValue`; do not present Storybook handler args such as `onClick` or `onFocus` as separate public events.
- Use explicit `fn()` handler args to populate Actions. Hide those `onX` args from ArgTypes with `table.disable: true`, then document the canonical event under `Events`.
- Override a docgen-discovered event when it needs a clearer description or payload type; do not create a duplicate row.
- Preserve native listener fallthrough when the corresponding native element is the component root. A root `<button>`, for example, supports Vue `@click` without declaring and re-emitting it.
- Declare typed emits for component-owned events and events forwarded from an inner element.

### Slots And Story Types

- Declare public slots with typed `defineSlots` entries and JSDoc descriptions so Doc Blocks can generate their rows.
- Show named slots in the API table, but exclude Vue instance metadata such as `$slots` globally.
- Use a story-only args type for Actions handlers or documentation rows that are not component props. Do not change the runtime component API for documentation-only concerns.

## Accessibility

Always include `Screen Reader` and `Keyboard Support` subsections.

- **Screen Reader:** Explain accessible names, labeling, announcements, and relationships. Add a short example when the correct pattern is not obvious.
- **Keyboard Support:** Use a key/function table for component interactions. State when native semantics provide the behavior.
- **Complex components:** Document behavior supplied by PrimeVue and any Axis-specific additions.

## Navigation And Release History

The global Storybook table of contents reads `h2` and `h3` headings. Do not add component-level version history; package changes belong in the package changelog and Release Notes.
