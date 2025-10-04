# Angular Stories Guidelines

This directory inherits guidance from the repository root, `storybooks/AGENTS.md`, and `storybooks/angular/AGENTS.md`. Author stories here using the Component Story Format while preserving parity with the React examples in `src/components/Button/Button.stories.tsx`.

- Import Angular modules from `src/angular` and shared helpers such as `ensureButtonStyles()` instead of duplicating CSS or tokens.
- Mirror the React args, controls, and documentation text so cross-framework regressions are easy to spot.
- Prefer inline `render` functions that showcase Angular templates and directives rather than bespoke wrapper components.

## Functional Changes
- 1.2.0: Added Angular Button stories that reuse shared styles and React-aligned controls.
- 1.5.4: Ensured button stories supply `moduleMetadata` within the shared render helper so `<fivra-button>` loads without NG0303 errors.
- 1.5.5: Button stories now import shared semantic style factories from `src/components/Button/story-helpers.ts` to match React palettes.
- 1.6.0: Documented dropdown aria defaults, added `ariaExpanded` args, and aligned stories with the harmonized button contract.
- 1.6.1: Added explicit `ariaHaspopup`/`ariaExpanded` controls and refreshed docs to describe the new adapter defaults surfaced in visual tests.
- 1.6.2: Synced button stories with the React baseline, refreshed docs/args, and added the web component preview.
- 1.6.3: Patched the Angular stories to hide duplicate native markup when the `<fivra-button>` custom element is registered.
- 1.6.4: Replaced the CSS shim with a DOM-level cleanup so Storybook prunes duplicate light DOM buttons once `<fivra-button>` is registered.
- 1.6.5: Removed the Angular web component story and related light DOM cleanup shim after confirming the nested button regression persists upstream.
- 1.6.6: Deprecated Web Component from Angular stories.
