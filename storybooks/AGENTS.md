# Storybook Workspaces Guidelines

This directory follows the repository root `AGENTS.md`. Use it to house framework-specific Storybook workspaces that share design tokens, themes, and authoring conventions.

- Keep workspace-level READMEs, configs, and scripts aligned so React, Angular, and Web Component previews remain visually consistent.
- Prefer importing shared assets (styles, helpers, icons) from `src/` instead of duplicating content under `storybooks/`.
- Document any framework-specific tooling or setup requirements inside each workspace's `AGENTS.md`.

## Functional Changes
- 1.2.0: Added the Angular Storybook workspace with dedicated configuration and shared asset guidance.
- 1.3.0: Documented the Angular button `moduleMetadata` fix to keep framework workspaces aligned.
- 1.3.1: Clarified that Angular stories embed their module imports via the shared render helper instead of relying on decorators.
- 1.3.2: Restored the Angular button story decorator so composed previews keep their module-provided styles while the render helper still supplies metadata.
