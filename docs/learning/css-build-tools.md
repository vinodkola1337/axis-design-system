# CSS Build Tools

CSS build tools process styles before they reach the browser. They may expand framework directives, transform modern CSS, add browser compatibility fixes, bundle files, or minify output.

---

## PostCSS

PostCSS is a CSS plugin framework.

It is commonly used for:

- Tailwind CSS processing
- Autoprefixer
- CSS transforms through plugins
- project-specific CSS processing

PostCSS is useful when the project needs its plugin ecosystem. It is not automatically replaced by Lightning CSS.

---

## Lightning CSS

Lightning CSS is a fast CSS compiler written in Rust.

It is commonly used for:

- CSS minification
- vendor prefixing
- modern CSS syntax lowering
- CSS nesting transforms
- CSS processing inside tools like Storybook or Vite

Lightning CSS can replace some PostCSS plugin workflows, especially standard transforms and minification. It does not replace arbitrary PostCSS plugins.

If Storybook pulls Lightning CSS into `pnpm-lock.yaml`, treat that as normal build-tool internals unless the repo config explicitly uses it.

---

## Style Dictionary

Style Dictionary is not a normal CSS build tool. It is a token compiler.

It converts token source files into outputs like:

- `dist/tokens.css`
- `dist/index.js`

In Axis, Style Dictionary runs before the CSS build pipeline. It creates CSS variables and JS exports that Tailwind, Vue components, and Storybook can consume.

---

## Mental Model

```text
Token JSON
  -> Style Dictionary
  -> CSS variables / JS exports
  -> Tailwind / component CSS / Storybook
  -> PostCSS or Lightning CSS
  -> final CSS bundle
```

| Tool | Mental model | Main job |
|------|--------------|----------|
| PostCSS | Plugin framework | Run CSS plugins like Tailwind or Autoprefixer |
| Lightning CSS | CSS compiler | Fast built-in transforms and minification |
| Style Dictionary | Token compiler | Generate token outputs like CSS variables |

If SCSS is used, Sass usually runs before these CSS processors:

```text
SCSS -> Sass -> CSS -> PostCSS / Lightning CSS
```

---

## Axis Guidance

- Do not add Lightning CSS explicitly unless there is a concrete build requirement.
- Do not remove PostCSS if Tailwind or another plugin still needs it.
- Treat Style Dictionary as the token build step, not as a PostCSS or Lightning CSS replacement.
- Keep component styling token-driven. Build tools should support the token pipeline, not drive component design.
