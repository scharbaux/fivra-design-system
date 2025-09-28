# Button Component Guidelines

This directory follows the repository and `src/components/` standards. Keep shared logic (styles, tokens, accessibility helpers) framework-agnostic so React, web components, and future adapters stay in sync.

- Prefer data attributes over brittle class name selectors when syncing styles between frameworks.
- Mirror any API changes in the accompanying Storybook stories, tests, and documentation during the same change.
- Update the "Functional Changes" section below with a short note when behavior or public API changes.

## Functional Changes
- 2025-09-25: Initial `Button` component authored as both a React component and custom element with shared styling.
- 2025-10-02: Button styling variables now map directly to Engage/Legacy design tokens (backgrounds, states, spacing, radii, icon sizes).
