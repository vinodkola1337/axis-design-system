# Documentation Architecture

Storybook is hosted by the private `@axis/docs` package. Stories and MDX remain colocated with UI components so implementation, examples, and API metadata evolve together.

- Stories import local Vue source for reliable docgen.
- The docs host owns Storybook runtime dependencies and processes UI source with the Vue and Tailwind plugins.
- API tables are generated from Vue metadata rather than duplicated manually.
- Vitest browser and accessibility automation are independent of whether the Interactions panel is shown.
- System-level guidance such as colors, typography, spacing, accessibility, and icons lives under Storybook Styles pages.

Authoring structure, Controls, events, slots, Actions, and accessibility documentation rules live in `docs/component-documentation.md`.
