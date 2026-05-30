# Axis Design System

Token-driven, scalable UI system. Tokens are the single source of truth for design and engineering.

## Stack

- Vue 3 + TypeScript
- Storybook 8
- Tailwind CSS
- Style Dictionary for token transforms
- Tokens Studio for Figma token editing
- pnpm workspace monorepo

## Repository Structure

- `packages/tokens`: design token source files and Style Dictionary build output
- `packages/ui`: Vue component library
- `packages/docs`: Storybook documentation app
- `docs/spec.md`: project progress tracker and implementation source of truth
- `docs/architecture.md`: architecture, package strategy, and design decisions

## Required Workflow

- Read `docs/spec.md` at the start of any implementation session to understand current project state.
- Treat `docs/spec.md` as the progress source of truth. Update checklist items inline as phases complete.
- Do not reconstruct project progress by scanning the codebase when the spec already states the current phase.
- When an architectural or spec-related decision is made, update `docs/architecture.md` or `docs/spec.md` in the same session.
- Keep generated build output out of source control unless the repo explicitly changes that policy.

## Commands

- Install dependencies: `pnpm install`
- Build tokens: `pnpm run tokens:build`
- Build library packages: `pnpm run build`
- Run UI package in watch mode: `pnpm run dev`
- Run Storybook: `pnpm run storybook`
- Build Storybook: `pnpm run storybook:build`

## Architecture Rules

- Tokens are the single source of truth. Components must not hardcode visual values.
- Use three token tiers: primitive, semantic, and component.
- Components should reference semantic or component-level tokens, not primitive tokens directly.
- Dark and light themes must be handled through semantic token overrides.
- Theme changes should not require component implementation changes.
- Build components from scratch for form elements.
- Use PrimeVue unstyled for complex interactive components when appropriate.
- Support named imports and subpath exports for package consumers.
- Public npm packages use the `@vinodkola` scope: `@vinodkola/axis-tokens` and `@vinodkola/axis-ui`.
- `@axis/docs` is private and does not need publishing/versioning.

## Design Guidance

- Follow Material Design 3 principles for component behavior, layout, states, typography, accessibility, and adaptive design unless the repo documents an intentional Axis-specific divergence.
- When making a design-system choice, briefly call out the design rationale to the user so they can learn the tradeoff, especially when Material guidance leaves room for interpretation.
- Prefer adaptive, container-aware sizing over hardcoded dimensions or browser defaults. Components may fill their parent when that is the common Material-aligned behavior, but large-screen layouts should still be bounded by parent containers, max-widths, margins, or layout grids.
- Expose layout-control props only when they represent a reusable design-system decision, such as `fluid` for filling the parent container. Keep the parent layout responsible for final page-level width constraints.
- Prefer persistent, accessible labels and state communication. Presentation choices such as floating labels are valid when they preserve label availability and do not change unrelated layout behavior.
- Component-specific example: text fields should generally be fluid by default in form contexts, while non-fluid text fields should use tokenized min/default/max widths rather than relying on the browser's native input width.

## Versioning

- `axis-tokens` and `axis-ui` should use fixed synchronized versions.
- Use `@changesets/cli` before the first npm publish.
- Keep docs package versioning separate from public package versioning.

## Coding Guidelines

- Prefer existing repo patterns over new abstractions.
- Keep changes scoped to the package or document relevant to the task.
- Add or update tests and stories in proportion to the behavioral risk of the change.
- Prefer tokenized styling and CSS variables over local one-off values.
- Order Vue single-file component blocks as `<template>`, then `<script setup lang="ts">`, then `<style scoped>`.
- Avoid unrelated refactors while implementing feature or migration work.
