# Components Documentation Guidelines

This directory inherits the repository and `docs/` guidance. Keep component reference pages synchronized with the implementation and Storybook examples.

- Favor task-oriented sections: overview, usage, accessibility, theming, and web component registration.
- Link directly to source files and stories using relative paths when possible.
- Update the "Functional Changes" section below whenever documentation changes to reflect new component behavior.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Authored the initial Button reference guide covering React and custom element usage.
- 1.2.0: Documented tertiary styling, icon-only/dropdown/loading APIs, and new token references for the Button component.
- 1.8.0: Added Angular usage guidance for the Button component, covering modules, directives, and template projection APIs.
- 1.8.1: Cross-linked the Button docs to the component contract so updates stay synchronized across references.
- 1.8.2: Noted canonical Storybook and visual test references in the Button contract for doc maintainers.
- 1.9.0: Documented the Typography primitive, covering variant mapping, accessibility, and token references.
- 1.10.0: Added Box documentation outlining spacing tokens, layout helpers, and the shared contract link.
