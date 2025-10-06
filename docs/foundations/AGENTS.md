# Foundations Documentation Guidelines

This directory inherits all requirements from `../AGENTS.md`. Follow the repository root and `docs/` policies when updating foundations reference materials.

## Content Focus
- Maintain the canonical reference for design tokens, icon libraries, and other system primitives surfaced in Storybook.
- Keep code examples and embedded stories synchronized with the generated assets that ship from `src/` pipelines.
- Document restructuring efforts so navigation globs, imports, and tests stay aligned across docs and Storybook.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.13.1: Moved the Design Tokens MDX page, TokensTable specimen, and Icons Library story into `docs/foundations` to align with the sidebar restructuring.
- 1.13.2: Updated foundations docs to use the MDX3 `@storybook/blocks` entry points so remark-gfm renders tables correctly.
