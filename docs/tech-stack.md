# Fivra Design System – Tech Stack

This document captures the current tooling, languages, and automation that power the design system. Please update it whenever the stack evolves so it stays a reliable single source of truth.

## Languages & Frameworks
- **TypeScript** – primary language for component and tooling development (`typescript@^5.5.0`).
- **React 18** – UI framework used for Storybook stories and icon components (`react@^18.2.0`, `react-dom@^18.2.0`).
- **MDX** – used for rich documentation inside Storybook (`@mdx-js/react`).

## Build & Bundling Tooling
- **Vite 5** – Storybook builder via `@storybook/react-vite`, providing fast dev server and production builds.
- **Storybook 9** – component workbench configured with React + Vite, plus accessibility and design addons.
- **SVGO 3** – command-line optimization for SVG assets (`svgo@^3.0.2`).

## Storybook Setup
- Stories live under `src/**/*.stories.@(js|jsx|mjs|ts|tsx)` and `src/**/*.mdx`.
- Addons: Docs, Accessibility, and Designs for embedded Figma references.
- Production builds adjust `base: './'` and rewrite the Vite mocker entry to support GitHub Pages hosting.
- Development server enables Vite polling (`usePolling: true`, `interval: 200`) to improve reliability on networked filesystems.

## Icon Workflow
1. **Optimization** – `yarn optimize-icons` runs `scripts/optimize-icons.mjs` to recursively optimize SVG files in `src/shared/assets/icons`, retaining `viewBox` attributes and replacing literal `fill`/`stroke` colors with `currentColor`.
2. **Generation** – `yarn generate:icons` runs `scripts/generate-icons-map.mjs` to scan `src/shared/assets/icons`, extract path data and viewBox info, and emit `src/shared/icons/icons.generated.ts`. Variants default to `outline` and `solid`, but can be customized via `package.json#iconsGenerator.variants`.
3. **Storybook build hook** – `prebuild-storybook` triggers icon map generation prior to `storybook build` to ensure assets are up to date.

## Design Token & Theme Workflow
1. **Token transformation** – `yarn generate:tokens` invokes `scripts/generate-design-tokens.mjs`, which reads the Tokens Studio bundle, produces CSS per theme (`src/styles/themes/engage.css`, `legacy.css`), and emits the runtime manifest (`tokens.generated.ts`).
2. **Selector scoping** – the transformer rewrites each CSS file so Engage tokens apply to both `:root` and `[data-fivra-theme='engage']`, while other themes scope to their `data-fivra-theme` value. Import `src/styles/index.css` to register both layers.
3. **Automated hooks** – `prebuild` and `prestorybook` scripts call `yarn generate:tokens` so builds and Storybook always consume up-to-date theme assets.
4. **Runtime helpers** – `src/styles/themes/index.ts` re-exports manifest data, utility helpers, and the `FIVRA_THEME_ATTRIBUTE` constant for toggling themes in apps and tests.

## Package Management & Tooling Requirements
- **Node.js 18.17+ (22.x recommended)** – ensures compatibility with modern ECMAScript features and Storybook tooling.
- **Corepack** – must be enabled to manage Yarn releases bundled with Node >= 16.9.
- **Yarn 4.9.4** – enforced via the `packageManager` field; installs should use `yarn install --immutable` or CI’s `yarn install --frozen-lockfile`.

## Continuous Integration
- GitHub Actions workflows target Node 22, enable Corepack, install dependencies with Yarn 4, run icon optimization/generation, and deploy Storybook to GitHub Pages.
- Artifact uploads or auto-commits ensure regenerated icon assets are preserved on CI runs.

## Future Plans
_Planned: document additional frameworks (e.g., Vue, Svelte) and any multi-framework Storybook compositions once they are introduced._
