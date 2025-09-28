# Scripts Maintenance Guidelines

This file extends the repository root `AGENTS.md`. Always review the root conventions before modifying files in `scripts/`.

## Maintenance Expectations
- Keep scripts idempotent and well-documented with inline comments or README references when logic is non-trivial.
- Prefer Node.js with TypeScript or modern ECMAScript modules to maintain consistency with the build tooling.
- Ensure scripts validate inputs and fail fast with actionable errors.

## Multi-Framework Support
- When updating build or tooling scripts, confirm compatibility for React, Web Component, and planned framework bundles.
- Update icon pipeline scripts to support framework-specific import paths without duplicating assets.
- Provide automated checks or task runners that keep Storybook and test workflows aligned across frameworks.

## Review Checklist
- Respect root testing requirements and add unit coverage for complex script behavior when feasible.
- If a script change alters behavior or output, append a "Functional Changes" note in the associated commit or PR summarizing the impact.
- Document new or updated commands in `docs/` so teams understand cross-framework workflows.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Added `generate-design-tokens.mjs` to produce CSS themes and a manifest via Style Dictionary and Tokens Studio transforms.
- 1.0: Updated `generate-design-tokens.mjs` to build external themes against a single internal source set, emit only public variables, and capture the set pairing in the generated manifest.
