---
name: axis-component-docs
description: Create or update Axis Design System component documentation, Storybook MDX pages, stories, Controls, Actions, slots, events, API tables, and accessibility guidance. Use when working on component docs under packages/ui/src/components, Storybook Docs, component Controls, component API metadata, slots, emitted events, or documentation verification.
---

# Axis Component Docs

Use this skill to author or update Axis component documentation and its supporting Storybook stories.

## Before Editing

Read these files before making changes:

1. `docs/spec.md` for current project status and active priorities.
2. `docs/architecture/overview.md`, then `docs/architecture/documentation.md` for documentation ownership and source boundaries.
3. The target component's `.vue`, `.stories.ts`, `.mdx` if present, and `index.ts`.
4. `packages/ui/src/components/button/Button.mdx` and `packages/ui/src/components/button/Button.stories.ts` when the local pattern is unclear.
5. `packages/ui/src/components/.template.mdx` when creating a new MDX page.

Keep the component, stories, and MDX in the same component folder. Name the MDX file after the component, such as `Button.mdx`.

## Page Structure

Use these sections in order:

1. Overview
2. Usage
3. Variants
4. API
5. Accessibility

Treat the Docs page as the complete component guideline. Do not add a separate Guidelines section. Add another section only when the component genuinely needs it.

## Story And MDX Setup

- Attach MDX to story metadata with `<Meta of={Stories} />`.
- Remove `autodocs` after adding custom MDX to prevent duplicate Docs entries.
- Expose one sidebar story named `Playground`.
- Make `Playground` the component's interactive workbench.
- Support every meaningful public prop through Controls in `Playground`.
- Use `Playground` as the first Canvas after the Overview paragraph.
- Treat every other story as a documentation or test helper.
- Mark helper stories with `tags: ['!dev']` so they can be embedded in MDX without appearing in the sidebar.
- Create grouped helper stories for option families such as variants, sizes, and states.
- Do not create a visible standalone story for every prop value.
- Give helper stories a focused render.
- Add concise `parameters.docs.source.code` examples when Storybook's generated source is noisy.
- Use Storybook Doc Blocks for interactive examples and generated API tables.

## Overview

Write one short paragraph explaining the component's purpose and the task it supports. Do not list props, variants, or implementation details.

Immediately after the paragraph, render the most common configuration without adding another heading:

```mdx
<Canvas of={Stories.Playground} />
```

## Usage

Include a short Vue import and usage example for the common configuration.

Then add:

- Three to five concise recommendations with bold lead-ins.
- A reason tied to user outcomes, hierarchy, consistency, or accessibility.
- A two-column **Use / Avoid** table with two or three concrete comparisons.

Do not repeat every recommendation in the table. Translate relevant Material Design principles into Axis-specific guidance rather than quoting Material documentation.

Use GitHub-Flavored Markdown pipe tables instead of verbose HTML tables.

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

Generate props, slots, and emitted events from Vue component metadata instead of hand-maintained Markdown tables.

### Props And Controls

- Define component defaults in metadata `args` so `Playground` opens in the common configuration.
- Use typed story `args` and `argTypes` for every meaningful public component prop supported by `Playground`.
- Bind controlled args and Action handlers explicitly in the metadata render function so Playground changes are reflected by the component.
- Choose a sensible control type and define `options` for constrained values.
- Use `mapping` when a friendly control value must resolve to a complex runtime value, such as a Vue icon component.
- Document descriptions and defaults consistently with the component's runtime API.
- Disable Controls for values that are not meaningfully editable in Storybook.
- Exclude Vue framework metadata such as `key`, `ref`, `ref_for`, and `ref_key`.
- Treat generic `class` and `style` as fallthrough attributes, not component-owned props.

### Events And Actions

- Document canonical Vue event names such as `click`, `focus`, `blur`, and `update:modelValue`.
- Do not present Storybook handler args such as `onClick` or `onFocus` as separate public events.
- Use explicit `fn()` handler args to populate Actions.
- Hide `onX` Action args from ArgTypes with `table.disable: true`.
- Document the canonical event under `Events`.
- Override a docgen-discovered event when it needs a clearer description or payload type.
- Do not create duplicate event rows.
- Preserve native listener fallthrough when the corresponding native element is the component root.
- Declare typed emits for component-owned events and events forwarded from an inner element.

### Slots And Story Types

- Declare public slots with typed `defineSlots` entries and JSDoc descriptions so Doc Blocks can generate their rows.
- Show named slots in the API table.
- Exclude Vue instance metadata such as `$slots` globally.
- Use a story-only args type for Action handlers or documentation rows that are not component props.
- Do not change the runtime component API for documentation-only concerns.

## Accessibility

Always include `Screen Reader` and `Keyboard Support` subsections.

- **Screen Reader:** Explain accessible names, labeling, announcements, and relationships. Add a short example when the correct pattern is not obvious.
- **Keyboard Support:** Use a key/function table for component interactions. State when native semantics provide the behavior.
- **Complex components:** Document behavior supplied by PrimeVue and any Axis-specific additions.

## Navigation And Release History

The global Storybook table of contents reads `h2` and `h3` headings. Do not add component-level version history. Package changes belong in the package changelog and Release Notes.

## Verification

Run verification in proportion to the change:

- For story or MDX edits, run `pnpm run storybook:build`.
- For interaction, accessibility, or browser-test changes, run `pnpm run storybook:test` when available.
- Inspect the Docs page in Storybook when layout, Controls, slots, events, or API metadata changed.
- Update `docs/spec.md` only when project status or roadmap state changes.
