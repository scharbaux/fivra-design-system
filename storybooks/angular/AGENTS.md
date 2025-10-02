# Angular Storybook Workspace Guidelines

This workspace inherits the repository root and `storybooks/AGENTS.md` guidance. Use it to showcase Angular adapters while reusing the shared design tokens and story structure from the React workspace.

- Configure Storybook with the Angular renderer and Vite builder (`@storybook/angular` + `@storybook/builder-vite`) while mirroring global parameters/decorators used by other frameworks.
- Import Angular modules (for example `FivraButtonModule`) alongside shared helpers such as `ensureButtonStyles()` rather than redefining styles locally.
- Align args, controls, and documentation with the React stories so feature parity stays visible across frameworks.
- Document noteworthy configuration or story changes here when they affect Angular consumers.

## Functional Changes
- 1.2.0: Established the Angular Storybook workspace with shared theming decorators and button stories.
- 1.3.0: Normalized the HTML transform hook to plain JavaScript so the composed Storybook build succeeds.
- 1.4.0: Adopted the Angular CLI Storybook builders (start/build) via `ng run` to satisfy the SB 9 migration checks.
