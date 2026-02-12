# Angular Button Guidelines

This directory follows the repository, `src/components/`, and `src/angular/` standards. Keep the Angular adapter in parity with t
he shared button behavior and styling.

- Rely on `ensureButtonStyles()` from `@components/Button/button.styles` so CSS stays centralized without duplicating logic.
- Keep DOM structure, data attributes, and ARIA behavior aligned with the React and web component implementations.
- Update accompanying tests and documentation when adjusting the Angular API or markup.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.8.0: Added the Angular button component, directives, module, and test suite matching the shared button contract.
- 1.8.2: Re-exported the Angular button styles through `@components/Button/button.styles` so the React and web component adapters share the same module.
- 1.8.3: Inlined the color-mix helper within the Angular button styles to drop the `src/angular/styles` symlink dependency.
- 1.9.0: Synced boolean coercion, label detection, and dropdown aria fallbacks with the shared button contract; expanded tests to cover the behavior.
- 1.9.1: Converted the component/directives to standalone, exposed ariaHaspopup/ariaExpanded inputs, and wired Storybook JIT so Angular builds fuel the shared visual tests.
- 1.9.2: Mirrored host inline styles onto the internal button element and added coverage for CSS custom property overrides.
- 1.10.0: Added semantic palette APIs for success/warning/error styling without manual CSS custom property wiring.
- 1.11.0: Added `label`, semantic `color`, and direct color override inputs (`surfaceColor`, `borderColor`, `textColor`, `accentColor`) for copy-pasteable consumption without inline style objects.
- 1.11.1: Removed redundant `tone` input in favor of extensible `color` presets.
