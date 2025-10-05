# Typography Component Guidelines

This directory inherits the repository root `AGENTS.md` along with `src/components/AGENTS.md`. Follow those governance rules when updating implementation files, tests, stories, or documentation references tied to Typography.

## Component Contract
- Maintain the `Typography` primitive as a token-driven wrapper that maps variants to CSS custom properties defined in shared theme styles.
- Keep the public API framework-agnostic: style helpers and variant typings should remain reusable by future Angular, Vue, or web component adapters.
- Inject styles through `ensureTypographyStyles()` so consuming frameworks can opt into the same class- and data-attribute selectors without duplicating CSS.
- Document variant defaults, accessibility expectations, and truncation behaviors within this file and the docs page to keep cross-framework parity.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0.0: Introduced the React `Typography` component with shared style injector, tests, and stories consuming Engage theme tokens.
