# Angular Package Guidelines

This directory extends the repository root `AGENTS.md`. It captures conventions for the Angular workspace that complements the existing React and web component bundles.

## Structure
- Group Angular features by component and expose them through `public-api.ts` so `ng-packagr` can build a dedicated entry point.
- Keep adapters thin by importing shared tokens, constants, and helpers from `src/components` instead of duplicating styles.
- Export Angular modules alongside directives to make tree-shaking friendly bundles for downstream apps.

## Testing
- Author Angular unit tests with `@angular/core/testing` and Vitest. Initialize `TestBed` in `vitest.setup.ts` so Angular specs run next to the existing suites.
- Ensure projected content scenarios (templates, directives, inline children) are covered so wrapper `data-*` attributes stay in sync with other frameworks.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.8.0: Added the Angular workspace with the button component, directives, module, packaging config, and Vitest support.
