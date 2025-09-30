# Button Component Guidelines

This directory follows the repository and `src/components/` standards. Keep shared logic (styles, tokens, accessibility helpers) framework-agnostic so React, web components, and future adapters stay in sync.

- Prefer data attributes over brittle class name selectors when syncing styles between frameworks.
- Mirror any API changes in the accompanying Storybook stories, tests, and documentation during the same change.
- Update the "Functional Changes" section below with a short note when behavior or public API changes.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Initial `Button` component authored as both a React component and custom element with shared styling.
- 1.0: Button styling variables now map directly to Engage/Legacy design tokens (backgrounds, states, spacing, radii, icon sizes).
- 1.2.0: Added the tertiary variant, icon-only/dropdown/loading affordances, and explicit token-aligned spacing across implementations.
- 1.2.1: Corrected radius scaling, loading-state colors, and the custom element preview to match the updated button contract.
- 1.3.0: State layers now derive from accent-driven `color-mix()` overlays with documented semantic overrides in Storybook.
