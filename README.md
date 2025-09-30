# Fivra Design System

## Overview
The Fivra Design System packages reusable tokens, icons, components, and documentation that are synchronized with the Fivra product experience. It replaces earlier demo content (including the "Figma Icon Exporter" prototype) with a production-focused library that can be consumed by React, Angular, Vue, or standards-based web components. In addition to UI primitives, the repository includes a Storybook instance that demonstrates implementation guidance and provides designers and engineers with a shared reference.

For a deeper look at the architecture decisions, see the evolving documentation in [`docs/tech-stack.md`](docs/tech-stack.md) and forthcoming guides under `docs/architecture/` (coming soon).

## Goals
- Ship a consistent, accessible, and themeable component library that mirrors the design language in Figma.
- Support multi-framework adoption by exporting framework-agnostic tokens with React components, an Angular package, and standards-based web components (Vue wrappers are planned).
- Automate the icon and asset pipeline so generated artifacts stay in sync with Figma exports.
- Provide a reference Storybook to surface usage examples, accessibility notes, and design guidelines.

## Tech Stack
- **Language & Tooling**: TypeScript, Vite, Storybook 9, Yarn 4 (via Corepack), SVGO, and modern linting/formatting tooling. The living stack is documented in [`docs/tech-stack.md`](docs/tech-stack.md).
- **Build Targets**: ESM packages for direct consumption, generated icon maps, and Storybook static builds for documentation.
- **Planned Deliverables**: Framework-specific entry points (React today, Angular/Vue wrappers next), and web-component bundles for direct browser consumption.

## Components
- **Icon** – Renders generated SVG assets by name with outline/solid variants and accessibility helpers.
- **Button** – Multi-variant action trigger available as a React component, Angular module (`FivraButtonModule`), and `<fivra-button>` custom element that share styling tokens.

## Local Development
### Requirements
- Node.js 18.17+ (Node 22.x recommended)
- Corepack (bundled with Node ≥ 16.9)
- Yarn 4.9.4 (activated through Corepack)

Check your environment:

```bash
node -v
corepack --version || echo "Corepack bundled with Node"
yarn -v || echo "Use Corepack to activate Yarn 4"
```

Enable Corepack and activate Yarn 4 on first use:

```bash
corepack enable
corepack prepare yarn@4.9.4 --activate
```

### Quick Start
Install dependencies and generate the icon map and theme tokens used by components:

```bash
yarn install --immutable
yarn generate:icons
yarn generate:tokens
```

Run Storybook for local development:

```bash
yarn storybook
```

Build the component package (production output):

```bash
yarn build
```

This generates React, Angular, and web component bundles before copying shared CSS/font assets into each distribution target.

If you prefer to preview the static Storybook output, run:

```bash
yarn build-storybook
```

## Angular Usage

Install the design system package and include the Angular module wherever you bootstrap feature areas:

```ts
import { FivraButtonModule } from 'fivra-design-system/angular';

@NgModule({
  imports: [FivraButtonModule],
})
export class SharedUiModule {}
```

Project icons with either template inputs or attribute directives while the component keeps shared data attributes, ARIA states, and styles in sync with the React and web component implementations:

```html
<ng-template #downloadIcon>
  <fivra-icon name="download"></fivra-icon>
</ng-template>

<fivra-button
  variant="secondary"
  size="lg"
  [leadingIcon]="downloadIcon"
  dropdown
>
  Export Report
  <fivra-icon fivraButtonTrailingIcon name="chevron-down"></fivra-icon>
</fivra-button>
```

## Scripts
Commonly used scripts are listed below. Run them with `yarn <script>`.

- `generate:icons` – Scan `src/shared/assets/icons/**/*` and regenerate `src/shared/icons/icons.generated.ts`.
- `optimize-icons` – Normalize SVG assets with SVGO prior to generation.
- `generate:tokens` – Run the design token transformer (`scripts/generate-design-tokens.mjs`) to refresh `src/styles/themes/*.css` and `tokens.generated.ts`.
- `changeset` – Launch the interactive Changesets prompt to document the change surface area and select the appropriate semver bump.
- `version` – Apply accumulated Changesets (`changeset version`) to bump `package.json`, changelogs, and generated release metadata (`yarn run version`).
- `release` – Publish the release defined by Changesets (used by CI; requires `NPM_TOKEN`).
- `verify:agents` – Ensure modified directories updated their `AGENTS.md` with a new semantic-version bullet (runs automatically in CI).
- `storybook` – Start the Storybook 9 (React + Vite) dev server with hot reload.
- `build-storybook` – Produce a static Storybook bundle for deployment.
- `build` – Create the distributable library bundles.
- `build:angular` – Run `ng-packagr` against `src/angular` to produce the Angular entry point.
- `lint` / `typecheck` (coming soon) – Static analysis tasks that will be documented in the architecture guides.

Refer to `package.json` for the full list of scripts and watch the `docs/architecture/` directory for deeper implementation notes.

### Theming workflow
- Generated CSS lives in `src/styles/themes/` (`engage.css`, `legacy.css`) and is surfaced through `src/styles/index.css`.
- The Engage theme is the default and applies to `:root`; add `data-fivra-theme="legacy"` to any container to opt into the legacy variables at runtime.
- Run `yarn generate:tokens` whenever tokens change (or rely on the automated `prebuild`/`prestorybook` hooks) to keep the manifest and CSS up to date.

## Storybook Usage
- Storybook 9 runs on Vite 5 with the `@storybook/react-vite` framework.
- Accessibility, documentation, and design review workflows are supported via `@storybook/addon-a11y`, `@storybook/addon-docs`, and `@storybook/addon-designs`.
- Production builds set `base: './'` and include a Vite transform to ensure assets resolve correctly on GitHub Pages deployments.
- Icon galleries and component examples automatically consume the generated icon map; rerun `yarn generate:icons` when assets change.

Visit the published Storybook (if available) to explore live components, or run the local command above to iterate on new work.

## Release & Versioning Workflow
- Run `yarn changeset` on every PR that affects behavior, tooling, or documentation so the automated release pipeline can calculate semver bumps.
- After committing Changeset entries, update the relevant `AGENTS.md` files with a new `<major>.<minor>[.<patch>]` bullet summarizing the change—CI uses `yarn verify:agents` to enforce this requirement.
- Execute `yarn run version` locally to preview the resulting package version, then rerun `yarn build` and `yarn test` before pushing the release branch or triggering CI.
- The `Release` GitHub Actions workflow runs on pushes to `main`; it installs dependencies, validates AGENTS updates, runs Changesets versioning/publish steps, re-runs tests/builds post-version bump, and uploads the updated changelog.

## Contribution Guidelines
- Follow the Yarn/Corepack workflow described above; commits should not modify the lockfile unexpectedly.
- Keep icons and other generated artifacts in sync by running `yarn optimize-icons` and `yarn generate:icons` before opening a PR.
- Storybook stories should include accessibility notes, usage guidelines, and design references whenever possible.
- Review the appropriate `AGENTS.md` files for directory-specific standards before editing code or docs.
- When architecture guides are published under `docs/architecture/`, align code structure and naming with the documented conventions.

Please open issues or discussions for large proposals (e.g., new framework adapters or token schemas) so maintainers can help scope and prioritize the work.
