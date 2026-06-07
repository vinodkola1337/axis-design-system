# Storybook Quick Reference

## Storybook Basics

- **Storybook**: A development environment for building, viewing, documenting, and testing UI components in isolation from the main application.
- **Story**: A named example of a component rendered with a specific set of props, slots, state, or context.
- **Component Story Format (CSF)**: Storybook's standard module format where a default export describes the component and named exports define its stories.
- **Canvas**: The panel that renders and lets you interact with the selected story.
- **Docs**: The generated documentation page that combines descriptions, examples, source snippets, and component API information.
- **Controls**: Interactive inputs that change a story's args without editing code.
- **Actions**: Logged callbacks that help inspect component events and user interactions.
- **Args**: The runtime values passed to a story, usually corresponding to component props.
- **ArgTypes**: Metadata that documents args and configures their Controls and Actions behavior.
- **Decorator**: A wrapper applied around stories to provide layout, themes, providers, or other shared context.
- **Parameter**: Static Storybook configuration that changes how a story, component, or the entire preview behaves.

## Why Storybook Is Used

- Storybook lets developers build component states without first creating a full application page.
- Storybook makes visual variants, edge cases, and accessibility states easy to review in one place.
- Storybook provides living documentation that stays close to the component implementation.
- Storybook gives designers, developers, and reviewers a shared component catalog.
- Storybook supports interaction, accessibility, visual regression, and browser tests through built-in features and addons.

## Why Axis Uses Storybook

- Axis uses Storybook as the documentation and development app for components from `@vinodkola/axis-ui`.
- Axis uses Storybook to display basic components such as Button, TextInput, and Label in isolation.
- Axis uses Storybook to demonstrate each component's variants, sizes, states, usage guidance, and API.
- Axis uses Storybook Controls to verify public props interactively.
- Axis loads the token and UI styles globally so stories render with the same design-system source of truth as consuming apps.
- Axis can verify token or theme changes across many component examples without changing component implementations.

## Addons

- **Addon**: A package that extends Storybook with extra panels, tooling, documentation, testing, or preview behavior.
- **When to use an addon**: Add one when Storybook's core features do not cover a reusable documentation, testing, or development need.
- **Addon configuration**: Register project-wide addons in the `addons` array in `.storybook/main.ts`.
- **`@storybook/addon-docs`**: Adds documentation pages, MDX support, API tables, source blocks, and related Docs features.
- **Addon caution**: Addons increase dependencies and configuration, so only install features the design-system workflow will use.

## `main.ts`

- **Purpose**: `.storybook/main.ts` configures Storybook itself and is read when the Storybook server or production build starts.
- **Use `main.ts` for**: Story file discovery, addons, framework selection, builder options, documentation extraction, and build-time customization.
- **Do not use `main.ts` for**: Global story rendering styles, decorators, args, or preview behavior; those belong in `preview.ts`.
- **`StorybookConfig`**: The imported TypeScript type validates configuration supported by `@storybook/vue3-vite`.
- **`stories`**: `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` tells Storybook where to discover story modules and which extensions are accepted.
- **`addons`**: `['@storybook/addon-docs']` enables the Docs addon for the whole Axis Storybook.
- **`framework.name`**: `@storybook/vue3-vite` tells Storybook to render Vue 3 components and use Vite as the builder.
- **`framework.options`**: Holds options specific to the selected Vue 3 and Vite integration.
- **`docgen`**: `'vue-component-meta'` uses TypeScript-aware Vue analysis to extract props, defaults, events, slots, and descriptions for Docs and Controls.
- **Story discovery path**: `../../ui/src/**/*.stories.*` lets the docs app discover stories colocated with UI components.

## `vite.config.ts`

- **Purpose**: `packages/docs/vite.config.ts` configures the Vite instance used by the Storybook host.
- **Vue plugin**: `@vitejs/plugin-vue` lets Vite compile `.vue` files imported by colocated stories.
- **Tailwind plugin**: `@tailwindcss/vite` processes the UI package's source-level global Tailwind CSS.
- **When to use it**: Change this file for Vite plugins, aliases, transforms, or dependency handling needed by the Storybook build.
- **Difference from `main.ts`**: `main.ts` configures Storybook features while `vite.config.ts` configures the underlying module compiler and bundler.

## `preview.ts`

- **Purpose**: `.storybook/preview.ts` configures how every story is rendered inside the preview iframe.
- **Use `preview.ts` for**: Global CSS imports, parameters, decorators, global args, global types, themes, providers, and shared render behavior.
- **Do not use `preview.ts` for**: Story discovery, addon registration, or framework selection; those belong in `main.ts`.
- **`Preview`**: The imported TypeScript type validates global preview configuration for Vue 3 Storybook.
- **Token CSS import**: `@vinodkola/axis-tokens/dist/tokens.css` makes Axis token variables available to all stories.
- **UI global CSS import**: `../../ui/src/styles/main.css` loads source-level Tailwind and global UI styles without duplicating component SFC styles.
- **`parameters`**: Defines global defaults that apply to every story unless a component or individual story overrides them.
- **`actions`**: Configures how Storybook detects and displays callback activity in the Actions panel.
- **`actions.argTypesRegex`**: `^on[A-Z].*` treats args named like `onClick` or `onChange` as action callbacks.
- **`controls`**: Configures the Controls panel used to edit story args interactively.
- **`controls.disableSaveFromUI`**: `true` hides the feature that saves Control changes from the Storybook UI.
- **`controls.expanded`**: `true` expands Control rows to show descriptions and default-value documentation.
- **`controls.matchers`**: Defines naming patterns that automatically select specialized Control types.
- **`controls.matchers.color`**: `/(background|color)$/i` gives matching args a color-picker Control.
- **`controls.matchers.date`**: `/Date$/i` gives matching args a date-picker Control.
- **`controls.sort`**: `'requiredFirst'` lists required component props before optional props.
- **`docs`**: Configures globally generated Storybook documentation.
- **`docs.source`**: Configures the source-code block shown for stories on Docs pages.
- **`docs.source.type`**: `'dynamic'` updates displayed source to reflect current args where supported.
- **`layout`**: `'centered'` centers every story in the preview canvas unless the story overrides the layout.

## When To Use Which File

- Change `main.ts` when Storybook must discover, load, build, or analyze something differently.
- Change `vite.config.ts` when Vite must compile, resolve, or transform something differently.
- Change `preview.ts` when all stories must render or behave differently.
- Change a `*.stories.ts` file when only one component's examples, args, controls, or documentation need to change.
- Set a parameter in `preview.ts` for a global default and override it in component metadata or an individual story for exceptions.
- Import design-system CSS in `preview.ts` because CSS affects story rendering rather than Storybook startup configuration.
- Register addons in `main.ts` because Storybook must load them before constructing its manager and preview.
- Run `pnpm run storybook` from the repository root because the command builds token output before starting Storybook.
- Keep component stories beside their `.vue` files so implementation, examples, and generated metadata use the same source.
