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
