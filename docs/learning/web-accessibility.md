## What Accessibility Means

Web accessibility means designing and building an interface so people can
perceive, understand, navigate, and operate it using different senses, input
methods, and assistive technologies. The goal is equivalent access to the same
content and actions, not a separate version of the product.

## Why We Need It

People experience interfaces in different ways, permanently, temporarily, or
because of their environment:

- Screen-reader users need meaningful content expressed as text and
  programmatic semantics, not only as visual icons or layout.
- Deaf and hard-of-hearing users need captions that include speech and
  important sounds.
- People with low vision need sufficient contrast: a measurable difference in
  brightness between foreground and background colors.
- People with color-vision deficiencies may not distinguish certain colors,
  so meaning needs another cue such as text, an icon, a pattern, or shape.
- People who cannot use a mouse need complete keyboard operation and a visible
  indication of where focus is.
- People with cognitive or learning disabilities benefit from clear labels,
  predictable behavior, and actionable error messages.
- Assistive technologies need valid HTML and correct names, roles, states, and
  relationships to interpret a component reliably.

These practices also help people with an injured hand, a noisy environment,
bright sunlight, a small screen, a missing mouse, or a slow connection.

## Developer Mental Model

When developing a component, remember **POUR** and ask:

- **Perceivable:** Can users get the information without relying on one sense,
  such as sight, hearing, or color perception?
- **Operable:** Can users complete every action with different input methods,
  especially a keyboard?
- **Understandable:** Are the purpose, state, behavior, instructions, and
  errors clear and predictable?
- **Robust:** Can browsers and assistive technologies determine the
  component's name, role, value, state, and relationships?

## Shared Responsibility

> The design system provides accessible structure and behavior. The consumer
> provides purpose and context.

Axis should provide native semantics, keyboard behavior, focus management,
accessible states, and tokenized visual requirements by default. Consumers
must provide application-specific meaning, such as labels, instructions, and
the relationships between components.

A native button's visible text is already its accessible name, so it does not
need a redundant `aria-label`:

```vue
<Button>Save changes</Button>
```

An icon-only button has no visible text, so the consumer must provide its
purpose:

```vue
<Button aria-label="Delete invoice">
  <Icon :icon="Trash" />
</Button>
```

The design system can require and forward an accessible name, but it cannot
infer whether the action means "Delete invoice", "Remove attachment", or
something else in the consuming application.

## WCAG

The **Web Content Accessibility Guidelines (WCAG)** define the outcomes an
accessible user experience must achieve. WCAG 2.2 groups its requirements
under four principles, commonly remembered as **POUR**.

### Perceivable

Users must be able to perceive the content.

- Provide text alternatives for meaningful icons and images.
- Provide captions for video.
- Maintain sufficient color contrast.
- Do not communicate information through color alone.

### Operable

Users must be able to operate the interface.

- Support complete keyboard interaction.
- Provide visible focus indicators.
- Use adequately sized interaction targets.
- Avoid keyboard traps.
- Give users enough time to complete actions.

### Understandable

Content and behavior must be clear and predictable.

- Use persistent, descriptive labels.
- Provide clear validation and recovery guidance.
- Keep navigation and interaction patterns consistent.
- Avoid unexpected changes of context.

### Robust

Content must work reliably across browsers and assistive technologies.

- Prefer valid, semantic HTML.
- Expose correct accessible names, roles, values, and states.
- Make important status updates available to screen readers.

WCAG defines three conformance levels:

- **A:** essential baseline requirements
- **AA:** the standard target for most products
- **AAA:** additional requirements that may not be practical for every page

Axis targets **WCAG 2.2 Level AA**.

## WAI-ARIA

**Web Accessibility Initiative - Accessible Rich Internet Applications
(WAI-ARIA)** defines attributes that expose custom interface semantics to
assistive technologies.

ARIA can communicate:

- What a component is: `role="dialog"`
- Its accessible name: `aria-label` or `aria-labelledby`
- Its current state: `aria-expanded="true"`
- Its relationships: `aria-controls="menu-id"`
- Dynamic updates: `aria-live="polite"`

ARIA does not automatically provide:

- Keyboard interaction
- Focus management
- Visual styling or contrast
- Native browser behavior

These behaviors must still be implemented and tested.

## Prefer Native HTML

The first rule of ARIA is to use native HTML when it already provides the
required semantics and behavior.

```html
<!-- Preferred -->
<button type="button">Save</button>

<!-- Avoid when a native button is sufficient -->
<div role="button" tabindex="0">Save</div>
```

A native `button` already supplies focus behavior, keyboard activation,
semantics, and disabled-state support. A custom element requires those
features to be recreated correctly.

ARIA is most useful for complex widgets without a complete native equivalent,
such as tabs, comboboxes, menus, and modal dialogs.

## How the Standards Relate

- **WCAG defines accessibility outcomes** that websites and components should
  meet for people with disabilities. It covers visual design, keyboard use,
  content, interaction, and assistive technology.
- **WAI-ARIA provides technical attributes** that communicate an element's
  name, role, state, and relationships to assistive technologies.

Passing an automated ARIA check does not establish WCAG conformance. Automated
testing should be combined with keyboard, screen-reader, zoom, contrast, and
manual interaction testing.

## Axis Example: Text Field

An accessible Axis text field needs more than an `aria-label`:

```html
<label for="email">Email address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-help email-error"
  aria-invalid="true"
/>
<p id="email-help">Use your work email.</p>
<p id="email-error">Enter a valid email address.</p>
```

The component also needs:

- Keyboard usability
- A visible focus indicator
- Tokenized colors that meet AA contrast requirements
- Error communication that does not rely on color alone
- An adequate interaction target
- A persistent accessible label
- Screen-reader verification

Accessibility is part of the component contract, not an optional visual
variant. Components should encode accessible semantics and behavior by
default, while design tokens enforce shared visual requirements such as color,
focus indication, and target sizing.

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
