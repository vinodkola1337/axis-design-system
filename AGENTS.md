# Axis Design System

Axis is a token-driven Vue 3 design system in a pnpm workspace. Design tokens are the shared source of truth for design and engineering.

## Always Follow

- Prefer existing repository patterns and keep changes scoped to the requested work.
- Components must use semantic or component tokens for visual values, never primitive tokens or hardcoded visual values.
- Follow Material Design 3 principles unless Axis documents a deliberate divergence, and briefly explain the rationale for design-system choices.
- Keep generated build output out of source control unless the repository policy explicitly changes.
- Add or update tests and stories in proportion to the behavioral risk.
- Order Vue single-file component blocks as `<template>`, `<script setup lang="ts">`, then `<style scoped>`.
- Update the relevant documentation when project status, architecture, or an established workflow changes.

## Read When Relevant

- Before implementation work, read `docs/spec.md` for current status and priorities. Update it when roadmap status changes.
- For architecture, package boundaries, tokens, theming, component strategy, design guidance, or releases, read `docs/architecture/overview.md` and follow its domain routing before making decisions.
- For component documentation, Storybook Docs, stories, Controls, slots, events, or API tables, read `docs/component-documentation.md` before editing.

Do not load specialized documents when their subject is unrelated to the task.

## Repository Map

- `packages/tokens`: token sources and Style Dictionary configuration
- `packages/ui`: Vue component library
- `packages/docs`: private Storybook documentation app
- `docs/spec.md`: current project status and roadmap
- `docs/architecture/overview.md`: architecture overview and domain routing
- `docs/component-documentation.md`: component documentation authoring workflow

## Commands

- Install dependencies: `pnpm install`
- Build tokens: `pnpm run tokens:build`
- Build packages: `pnpm run build`
- Run package watch mode: `pnpm run dev`
- Run Storybook: `pnpm run storybook`
- Build Storybook: `pnpm run storybook:build`
