# Angular Storybook Configuration Guidelines

This directory inherits the repository root, `storybooks/AGENTS.md`, and `storybooks/angular/AGENTS.md` standards. Apply the same configuration practices documented in `.storybook/AGENTS.md` while adapting them to the Angular renderer.

- Author configuration in TypeScript with explicit `StorybookConfig` typings.
- Keep addon, alias, and builder settings aligned with the React workspace so shared imports resolve consistently.
- Update the change log below whenever Storybook behavior changes for Angular consumers.

## Functional Changes
- 1.2.0: Added Storybook 9 Angular configuration with shared Vite aliases and production base handling.
- 1.5.0: Switched the Angular Storybook config to `viteFinal` with shared server and production tweaks.
- 1.5.2: Added the Angular Vite plugin loader to ensure internal Angular packages compile in Storybook.
- 1.5.3: Expanded the Vite dev server allow-list to cover the Angular workspace root and prevent 403s.
- 1.5.4: Injected `STORYBOOK_ANGULAR_OPTIONS` via Vite `define` so Angular framework options propagate without runtime errors.
