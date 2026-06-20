# Axis Design System - Project Status

Read this file before implementation work. It is the progress source of truth; do not reconstruct project status by scanning the codebase. Architecture and authoring guidance belong in their dedicated documents.

## Current State

- [x] Monorepo, token build pipeline, UI package, and Storybook 10 documentation app are established.
- [x] The three-tier token model (primitive, semantic, and component) is in use.
- [x] Button, Icon, TextInput, and Label are implemented and tokenized.
- [x] Core Storybook foundations, system style documentation, accessibility tests, and the component documentation template are established.
- [x] Button documentation is complete.

## In Progress

- [ ] Add complete TextInput documentation using the component documentation template.
- [ ] Complete interactive Controls for public component props.
- [ ] Complete slot and emitted-event documentation where applicable.
- [ ] Verify Storybook Docs pages and Controls in the browser and production build.

## Roadmap

- [ ] Establish PrimeVue in unstyled mode and build Table, DatePicker, and Dialog.
- [ ] Add dark theme tokens and a Storybook theme toggle without component changes.
- [ ] Configure Changesets with fixed versions for the public packages.
- [ ] Publish `@vinodkola/axis-tokens` and `@vinodkola/axis-ui` version `0.1.0`.
- [ ] Deploy Storybook to Vercel.
