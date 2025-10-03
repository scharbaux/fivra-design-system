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
- 1.5.0: Migrated the Angular Storybook workspace to the Vite builder and aligned the scripts with the React/Vue setups.
- 1.5.1: Added CORS headers to the Vite dev server so React can compose the Angular ref without sidebar errors.
- 1.5.2: Wired the Angular Vite plugin and dev server allow-list so internal Angular packages load in Storybook.
- 1.5.3: Forced the Storybook TypeScript config into full AOT mode so Ivy metadata is emitted without JIT during static builds.
- 1.5.4: Routed button stories through an inline `moduleMetadata` helper so Angular modules register during Storybook renders.
- 1.5.5: Simplified the button story metadata to only import `FivraButtonModule`, removing redundant decorators that caused NG0303 warnings.
- 1.5.6: Reintroduced the shared button story decorator alongside the render metadata so Angular previews retain styles without NG0303 errors during composition.
