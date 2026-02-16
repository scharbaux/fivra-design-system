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
- 1.0.1: Replaced React Storybook layout wrappers with the Box primitive to share spacing utilities across examples.
- 1.1.0: Added a React/Vue Storybook parity test to keep Typography story exports and argTypes descriptions aligned across frameworks.
- 1.1.1: Added explicit React Typography docs-source snippets for composed stories so code previews stay consumer-focused.
- 1.1.2: Updated shared Typography token references to use canonical `--typography*` variables with legacy fallbacks so React/Vue stories resolve variant styles without undefined CSS custom properties.

- 1.1.3: Removed camel-case token fallback chains and standardized Typography variant CSS variables to kebab-case names.
