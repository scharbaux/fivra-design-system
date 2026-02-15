# Angular Button Guidelines

This directory follows the repository, `src/components/`, and `src/angular/` standards. Keep the Angular adapter in parity with t
he shared button behavior and styling.

- Rely on `ensureButtonStyles()` from the local `./button.styles` module so Angular packaging stays self-contained.
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
- 1.11.2: Updated shared button state-layer mixing so hover/active tint derives from surface color while focus remains anchored to the primary accent.
- 1.11.3: Updated variant tint sourcing so secondary uses border color and tertiary uses text color for hover/active state-layer mixes.
- 1.11.4: Adjusted hover/active color-mix operand order so the variant tint color is the weighted first operand, matching expected state rendering.
- 1.11.5: Applied variant-specific hover/active mix ordering so primary remains layer-first while secondary and tertiary are tint-first.
- 1.12.0: Mirrored the button style, state-layer, and color-override modules with `src/shared/button` while keeping Angular-local sources for `ng-packagr` rootDir compatibility.
- 1.12.1: Updated the Angular button adapter and tests to consume local button style modules directly instead of the @components alias bridge.
- 1.12.2: Fixed projected-label detection to ignore generated `label` fallback nodes so Angular Storybook no longer enters a render loop when consumers provide only the `label` input.
- 1.13.0: Added Box-derived structural classes (`fivra-box`) and reset injection to the Angular button root/wrappers to align baseline layout behavior with React and Vue Box composition.
