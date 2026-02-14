# Foundations Documentation Guidelines

This directory inherits all requirements from `../AGENTS.md`. Follow the repository root and `docs/` policies when updating foundations reference materials.

## Content Focus
- Maintain the canonical reference for design tokens, icon libraries, and other system primitives surfaced in Storybook.
- Keep code examples and embedded stories synchronized with the generated assets that ship from `src/` pipelines.
- Document restructuring efforts so navigation globs, imports, and tests stay aligned across docs and Storybook.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.13.1: Moved the Design Tokens MDX page, TokensTable specimen, and Icons Library story into `docs/foundations` to align with the sidebar restructuring.
- 1.14.0: Reworked the Design Tokens reference into a fullscreen, filter-driven table viewport with theme/category selectors and updated composite-token tests for the latest token source-of-truth shape.
- 1.14.1: Added token text search, explicit description column, fixed-height internal table scrolling, and full-width docs layout overrides while enforcing no horizontal table overflow.
- 1.14.2: Added CSS-variable click-to-copy affordances, improved typography/icon/spacing specimens, introduced checkerboard-backed color specimens (including category-aware sphere/text rendering), and expanded the token workspace to fill the viewport height.
- 1.15.0: Added diagnostics-first token docs enhancements including expandable composite property panels, unresolved-reference warning badges/filters, curated category intros, an AA contrast helper panel, and snapshot-based added/changed/removed token diff indicators.
- 1.15.1: Split Design Tokens content into a focused reference page plus a dedicated `Design Tokens: Workflow` page so generation/refresh guidance is separate from day-to-day token exploration.
- 1.15.2: Renamed the explorer page to `Design Tokens: Reference`, fixed docs cross-links to Storybook paths, and enforced Foundations sidebar ordering (`Reference`, `Workflow`, then `Icons Library`).
