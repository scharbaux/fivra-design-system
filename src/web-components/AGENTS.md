# Web Components Guidelines

This directory extends the repository and `src/components/` guidance for custom elements.

- Keep custom element classes framework-agnostic and avoid importing React-specific utilities.
- Mirror property/attribute changes across React wrappers and Storybook stories when behavior changes.
- Update the "Functional Changes" log below whenever a web component gains new capabilities.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Registered the `<fivra-button>` custom element that mirrors the shared Button styles and attributes.
- 1.0: Ensured `defineDesignSystemElements` explicitly imports `defineFivraButton` to support isolated DTS builds.
- 1.0: Synced injected button styles with tokenized variables so the custom element reflects theme spacing, colors, and focus states.
- 1.2.0: Synced icon-only, dropdown, loading, and tertiary variant behavior with the React adapter, including new data attributes and ARIA forwarding.
- 1.2.1: Added overlay mix regression tests to ensure brand versus neutral button states stay aligned with the React implementation.
- 1.3.0: Synced primary halo custom properties to weight hover, active, and focus glows toward the accent color by default, mirroring the React implementation.
- 1.3.1: Repointed the button element to consume a single shared style module so all frameworks share the same tokens.
- 1.3.2: Updated the button element to import styles through a unified cross-framework button style path.
- 1.4.0: Added trimmed label detection, dropdown aria fallbacks, and unit tests mirroring the shared button contract.
- 1.5.0: Added semantic palette attributes to apply success/warning/error styling without manual CSS custom property wiring.
- 1.6.0: Added `label`, semantic `color`, and direct color override attributes (`surface-color`, `border-color`, `text-color`, `accent-color`) for copy-pasteable consumption without inline style objects.
- 1.6.1: Removed redundant `tone` attribute in favor of extensible `color` presets.
- 1.6.2: Synced web-component button state-layer behavior so hover/active use surface-driven tinting while focus remains tied to the primary accent.
- 1.6.3: Updated shared variant tint mapping so secondary hover/active mixes follow border color and tertiary follow text color.
- 1.6.4: Updated hover/active color-mix operand order so the variant tint is weighted first for expected hover intensity in custom elements.
- 1.6.5: Synced variant-specific mix ordering so primary remains layer-first while secondary and tertiary use tint-first hover/active blends.
- 1.6.6: Switched the web-component button to import shared button styles and semantic color overrides from src/shared/button.
- 1.6.7: Cleaned AGENTS history wording to match the shared-button-core terminology.
