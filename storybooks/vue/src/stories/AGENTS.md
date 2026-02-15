# Vue Stories Guidelines

This directory inherits guidance from the repository root, `storybooks/AGENTS.md`, and `storybooks/vue/AGENTS.md`. Author Vue 3 Component Story Format examples here while keeping controls and documentation aligned with the React and Angular stories.

- Call `ensureButtonStyles()` (or other shared helpers) when showcasing button primitives so CSS stays sourced from `src/components`.
- Mirror args, argTypes, and docs descriptions from the React stories to maintain cross-framework parity, even when the Vue implementation is still a scaffold.
- Prefer inline render functions or `<template>` usage that demonstrates how Vue consumers will eventually integrate the components.

## Functional Changes
- 1.3.0: Added placeholder Vue button stories that load shared styles and expose the established controls.
- 1.4.0: Extended placeholder stories with dropdown coverage, aria fallback messaging, and updated props to mirror the harmonized button contract.
- 1.4.1: Mirrored the Angular/React controls for `ariaHaspopup`/`ariaExpanded` so the placeholder docs track the latest button contract.
- 1.4.2: Replaced placeholder button stories with React-parity coverage, semantic helpers, and the web component preview.
- 1.4.3: Updated Button stories to `Atomics/Button` with an explicit meta ID to align with the shared taxonomy and composed refs.
- 1.5.0: Updated the semantic override story to use the shared semantic palette API instead of style factories so the example matches end-user consumption.
- 1.6.0: Updated stories to prefer the `label` prop and semantic `color` alias for copy-pasteable consumer-facing examples.
- 1.6.1: Removed redundant `tone` story props after consolidating semantic presets under `color`.
- 1.6.2: Migrated Vue Button stories to use shared button style and color override modules from src/shared/button.
- 1.7.0: Added Vue Box stories with React-parity controls/docs and explicit docs source snippets so code previews avoid Storybook render scaffolding.
- 1.8.0: Extracted a reusable Vue Box preview module and refactored Vue Button stories to compose Box as the structural wrapper for the button specimen.
- 1.9.0: Added Vue Typography stories with React-parity args/argTypes/descriptions and shared Typography style injection.
- 1.9.1: Added explicit Typography docs source snippets (to avoid render-object previews) and ensured runtime style injection happens in the Vue Typography preview setup.
- 1.9.2: Updated Vue Typography docs token examples to match canonical `--typography*` variable names after aligning shared Typography variant CSS bindings.

- 1.9.3: Migrated Vue Box/Button/Typography story token references and docs text to kebab-case CSS custom property naming.
