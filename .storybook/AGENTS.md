# Storybook Configuration Guidelines

This document augments the repository root `AGENTS.md`. Review root conventions first, then apply these rules when editing files within `.storybook/`.

## Configuration Standards
- Author Storybook configuration files in TypeScript where supported, using explicit `StorybookConfig` typings and `export default`.
- Preserve and document alias, base, and plugin settings that keep React, Web Component, and documentation stories in sync.
- Resolve filesystem paths via `fileURLToPath` helpers (and `path.resolve` or `path.dirname`) so configs behave consistently across ESM and CommonJS runtimes.

## Workflow Expectations
- Keep production (`build-storybook`) and development (`storybook dev`) behaviors aligned; test both when altering config.
- When updating addons or frameworks, validate compatibility with our accessibility, docs, and design tooling before committing.
- Document notable configuration changes in PR descriptions and cross-reference related updates under `src/stories/` when behavior changes.

## Review Checklist
- Ensure `yarn storybook`, `yarn build-storybook`, and TypeScript type checks succeed after modifying configuration.
- Avoid introducing duplicated configuration files or unused legacy settings.
- Coordinate with component authors if configuration changes require story updates or new documentation.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Updated Storybook story globs to read MDX documentation from `docs/` so overview and integration pages render.
- 1.1.0: Added design token diagnostics and cleanup logging in the preview decorator to detect missing theme CSS during development.
- 1.2.0: Enabled multi-renderer Storybook builds by registering the Angular renderer, wiring up the Vite plugin, and extending the preview decorator so design tokens hydrate before Angular canvases render.
