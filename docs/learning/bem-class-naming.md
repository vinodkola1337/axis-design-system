# BEM-Style CSS Class Naming

BEM stands for **Block, Element, Modifier**. It is a CSS class naming convention that makes component styles easier to read and maintain.

Axis uses BEM-style names with an `axis-` namespace for component CSS.

```html
<div class="axis-text-input axis-text-input--invalid">
  <div class="axis-text-input__field">
    <input class="axis-text-input__control" />
  </div>
</div>
```

## Parts

**Block** is the standalone component root.

```css
.axis-text-input {}
```

**Element** is an internal part of that component. Elements use `__`.

```css
.axis-text-input__field {}
.axis-text-input__control {}
.axis-text-input__error {}
```

**Modifier** is a variant or state of the block or element. Modifiers use `--`.

```css
.axis-text-input--fluid {}
.axis-text-input--invalid {}
.axis-text-input--sm {}
```

## Why Axis Uses It

BEM-style naming makes the relationship between a component and its internal parts explicit. `axis-text-input__control` clearly belongs to `axis-text-input`, while `axis-text-input--invalid` clearly represents a state or variant of that component.

This avoids vague global names like `.input`, `.label`, `.error`, or `.large`, which can collide with consumer application styles or become unclear as the design system grows.

The `axis-` prefix is the design-system namespace. It further reduces the chance that Axis component classes conflict with application-level classes.

## Not The Same As Token Variables

CSS custom properties also start with `--`, for example:

```css
var(--axis-text-input-color-bg)
```

That `--` is required CSS syntax for custom properties. It is separate from the BEM modifier `--` used in class names like `.axis-text-input--invalid`.
