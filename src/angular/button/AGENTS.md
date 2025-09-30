# Angular Button Guidelines

This directory inherits the repository, `src/angular/`, and `src/components/Button/` guidance. Keep the Angular adapter aligned with the shared tokens and behaviors documented for React and the web component.

- Mirror data attributes, ARIA states, and helper methods so tests stay in sync across frameworks.
- Prefer content projection and template inputs instead of duplicating icon logic.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.8.0: Authored the Angular button component, module, directives, and Vitest coverage.
