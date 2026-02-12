# Button Component Guidelines

This directory follows the repository and `src/components/` standards. Keep shared logic (styles, tokens, accessibility helpers) framework-agnostic so React, web components, and future adapters stay in sync.

- Prefer data attributes over brittle class name selectors when syncing styles between frameworks.
- Mirror any API changes in the accompanying Storybook stories, tests, and documentation during the same change.
- Update the "Functional Changes" section below with a short note when behavior or public API changes.

## Component Contract

### Variants

| Variant | Description | Token hooks |
| --- | --- | --- |
| `primary` | High-emphasis action with accent backgrounds, halo, and strong focus ring. | `--backgroundPrimaryInteractive`, `--textOnPrimary`, `--haloPrimary*` |
| `secondary` | Neutral surface button with outlined emphasis and token-driven halo mix. | `--backgroundNeutral0`, `--borderNeutralStrong`, `--haloNeutral*` |
| `tertiary` | Low-emphasis ghost button with transparent background and hover/active overlays. | `--overlayNeutral*`, `--textPrimaryInteractive` |

### Sizes

| Size | Description | Measurement hooks |
| --- | --- | --- |
| `sm` | Compact control for dense layouts, 32px height, 14px type, 8px horizontal padding. | `--buttonHeightSm`, `--buttonPaddingXSm`, `--iconSizeSm` |
| `md` | Default control, 40px height, 16px type, 12px horizontal padding. | `--buttonHeightMd`, `--buttonPaddingXMd`, `--iconSizeMd` |
| `lg` | Spacious control for marketing/forms, 48px height, 18px type, 16px horizontal padding. | `--buttonHeightLg`, `--buttonPaddingXLg`, `--iconSizeLg` |

### Accessibility requirements

- Every button must expose an accessible name via inner text, `aria-label`, or `aria-labelledby`.
- Icon-only buttons set `iconOnly`/`icon-only` and **must** provide `aria-label`/`ariaLabel`.
- Loading state toggles `aria-busy="true"` and disables pointer events.
- Dropdown state appends `aria-haspopup="menu"` and sets `aria-expanded` when controlled.
- Focus states rely on `:focus-visible` tokens and maintain 3:1 contrast for outlines.

### Framework APIs

#### React (`<Button />`)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | `undefined` | Visible label content. Prefer this for straightforward usage. |
| `children` | `React.ReactNode` | `undefined` | Advanced: custom content; takes precedence over `label`. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Maps to variant tokens listed above. |
| `color` | `'primary-success' \| 'primary-warning' \| 'primary-error'` | `undefined` | Semantic palette alias. Prefer for docs examples. |
| `surfaceColor` | `string` | `undefined` | Overrides `--fivra-button-surface` using a design token string (e.g., `background-primary-success`). |
| `borderColor` | `string` | `undefined` | Overrides `--fivra-button-border` using a design token string (e.g., `border-primary-success`). |
| `textColor` | `string` | `undefined` | Overrides `--fivra-button-text` using a design token string (e.g., `text-primary-success`). |
| `accentColor` | `string` | `undefined` | Overrides `--fivra-button-accent` (drives state layers). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Adjusts typography, padding, and icon spacing tokens. |
| `fullWidth` | `boolean` | `false` | Sets `data-full-width` and expands to container width. |
| `leadingIcon` | `React.ReactNode` | `undefined` | Rendered with `aria-hidden="true"` before the label. |
| `leadingIconName` | `string` | `undefined` | Convenience: renders the shared Icon before the label (uses `currentColor`). |
| `trailingIcon` | `React.ReactNode` | `undefined` | Rendered with `aria-hidden="true"` after the label. |
| `trailingIconName` | `string` | `undefined` | Convenience: renders the shared Icon after the label (uses `currentColor`). |
| `iconOnly` | `boolean` | `false` | Applies max radius and enforces accessible naming. |
| `hasLabel` | `boolean` | `undefined` | Overrides automatic label detection when using visually hidden copy. |
| `dropdown` | `boolean` | `false` | Adds caret indicator and toggles disclosure data attributes. |
| `loading` | `boolean` | `false` | Shows spinner, sets `aria-busy`, and disables clicks. |
| `...buttonProps` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | – | Native button attributes (`type`, `disabled`, etc.). |

#### Angular (`<fivra-button>`)

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | `undefined` | Visible label content when no projected label is provided. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Mirrors React variant behavior. |
| `color` | `'primary-success' \| 'primary-warning' \| 'primary-error'` | `undefined` | Semantic palette alias. Prefer for docs examples. |
| `surfaceColor` | `string` | `undefined` | Overrides `--fivra-button-surface` using a design token string. |
| `borderColor` | `string` | `undefined` | Overrides `--fivra-button-border` using a design token string. |
| `textColor` | `string` | `undefined` | Overrides `--fivra-button-text` using a design token string. |
| `accentColor` | `string` | `undefined` | Overrides `--fivra-button-accent` (drives state layers). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Synchronizes spacing/typography tokens. |
| `fullWidth` | `boolean` | `false` | Applies `data-full-width` and sets `display: block`. |
| `iconOnly` | `boolean` | `false` | Requires `ariaLabel`/`ariaLabelledby`. |
| `hasLabel` | `boolean` | `undefined` | Forces label detection for off-screen content. |
| `dropdown` | `boolean` | `false` | Adds disclosure caret and `aria-haspopup`. |
| `loading` | `boolean` | `false` | Shows spinner, disables host, and sets `ariaBusy`. |
| `leadingIcon` | `TemplateRef<unknown>` | `undefined` | Projects template into leading slot. |
| `trailingIcon` | `TemplateRef<unknown>` | `undefined` | Projects template into trailing slot. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Proxies to internal `<button>` element. |
| `disabled` | `boolean` | `false` | Disables the control and sets `ariaDisabled`. |
| `ariaLabel` | `string` | `undefined` | Accessible name when no visual label is present. |
| `ariaLabelledby` | `string` | `undefined` | References elements that label the button. |

_Outputs_: `focus()` and `click()` methods proxy to the internal button for host bindings.

#### Web component (`<fivra-button>`)

| Attribute | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | – | Visible label content when no slotted label is provided. |
| `variant` | `primary \| secondary \| tertiary` | `primary` | Controls variant tokens. |
| `color` | `primary-success \| primary-warning \| primary-error` | – | Semantic palette alias. Prefer for docs examples. |
| `surface-color` | `string` | – | Overrides `--fivra-button-surface` using a design token string. |
| `border-color` | `string` | – | Overrides `--fivra-button-border` using a design token string. |
| `text-color` | `string` | – | Overrides `--fivra-button-text` using a design token string. |
| `accent-color` | `string` | – | Overrides `--fivra-button-accent` (drives state layers). |
| `size` | `sm \| md \| lg` | `md` | Adjusts size tokens. |
| `full-width` | boolean attribute | `false` | Stretches to container width. |
| `icon-only` | boolean attribute | `false` | Requires accessible name. |
| `has-label` | boolean attribute | `false` | Forces label detection for hidden text. |
| `dropdown` | boolean attribute | `false` | Adds disclosure caret and data attributes. |
| `loading` | boolean attribute | `false` | Shows spinner, disables pointer events. |
| `disabled` | boolean attribute | `false` | Reflects to internal button. |
| `type` | `button \| submit \| reset` | `button` | Mirrors `HTMLButtonElement` defaulting behavior. |

Slots: `leading-icon`, default, and `trailing-icon` provide icon/labelling parity with other frameworks. Methods `focus()`, `click()`, and `blur()` are forwarded to the internal button.

-### Canonical references

- React stories: [`Button.stories.tsx`](./Button.stories.tsx)
- React tests: [`__tests__/Button.test.tsx`](./__tests__/Button.test.tsx)
- Angular stories: [`../../storybooks/angular/src/stories/Button.stories.ts`](../../storybooks/angular/src/stories/Button.stories.ts)
- Angular implementation: [`../../angular/button/fivra-button.component.ts`](../../angular/button/fivra-button.component.ts)
- Angular tests: [`../../angular/button/__tests__/fivra-button.component.test.ts`](../../angular/button/__tests__/fivra-button.component.test.ts)
- Vue preview stories: [`../../storybooks/vue/src/stories/Button.stories.ts`](../../storybooks/vue/src/stories/Button.stories.ts)
- Web component: [`../../web-components/button.ts`](../../web-components/button.ts)
- Web component tests: [`../../web-components/__tests__/button.test.ts`](../../web-components/__tests__/button.test.ts)
- Visual regression tests: [`../../visual-tests/button.spec.ts`](../../visual-tests/button.spec.ts)
- Documentation: [`../../docs/components/button.md`](../../docs/components/button.md)

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Initial `Button` component authored as both a React component and custom element with shared styling.
- 1.0: Button styling variables now map directly to Engage/Legacy design tokens (backgrounds, states, spacing, radii, icon sizes).
- 1.2.0: Added the tertiary variant, icon-only/dropdown/loading affordances, and explicit token-aligned spacing across implementations.
- 1.2.1: Corrected radius scaling, loading-state colors, and the custom element preview to match the updated button contract.
- 1.3.0: State layers now derive from accent-driven `color-mix()` overlays with documented semantic overrides in Storybook.
- 1.4.0: Added per-variant overlay custom properties that weight neutral variants toward their accent color and documented/tested the behavior across React and web components.
- 1.5.0: Introduced halo custom properties for hover, active, and focus states to deliver consistent glow styling across implementations.
- 1.5.1: Primary hover halo now targets the layer mix to align with the hover background weighting across implementations.
- 1.6.0: Defaulted the button font family to the generated body token so React and web component builds use Google Sans.
- 1.7.0: Updated primary button halos to weight hover, active, and focus glows toward the accent color by default.
- 1.8.0: Added the Angular adapter (component + directives + module) with parity tests and packaging support.
- 1.8.1: Pointed React exports to the Angular-owned button style module so all frameworks share the same source without symlinks.
- 1.8.2: Added a components-level barrel that re-exports the Angular-owned button styles via `@components/Button/button.styles` so every adapter shares the same import path.
- 1.8.3: Pointed the shared tests at the canonical Angular button styles to cover the inlined color-mix helper.
- 1.8.4: Updated Button stories to import `Meta`/`StoryObj` from `@storybook/react-vite` so typings match the composed framework.
- 1.8.5: React Storybook now imports `defineFivraButton()` from `@web-components` and guards duplicate registration in the custom element preview.
- 1.8.6: Extracted shared Storybook semantic style helpers for React and Angular button stories to keep palettes aligned.
- 1.8.7: Documented the component contract, canonical references, and cross-linked the docs reference page for easier maintenance.
- 1.8.8: Added Storybook (React/Angular/Vue) and Playwright visual regression references to the contract for update tracking.
- 1.9.0: Harmonized label detection, dropdown aria defaults, and cross-framework stories/tests to lock the shared button contract.
- 1.9.1: Enabled Angular Storybook JIT builds and Playwright baselines so dropdown/loading coverage exercises the shared aria defaults.
- 1.9.2: Retitled the Button stories to `Atomics/Button` and set explicit story IDs for cross-framework Storybook composition.
- 1.9.3: Fixed `dropdown` type definition in the Web Component story.
- 1.9.4: Updated React Storybook examples to wrap layout scaffolding with the Box primitive for shared spacing tokens.
- 1.9.5: Updated Button stories icons related examples and adjusted colors.
- 1.9.6: Updated React Storybook docs-source snippets to be copy-paste friendly for semantic overrides and icon usage.
- 1.10.0: Added semantic palette APIs (success/warning/error) across adapters and introduced React `leadingIconName`/`trailingIconName` convenience props.
- 1.11.0: Added `label` and semantic `color` plus direct color override props (`surfaceColor`, `borderColor`, `textColor`, `accentColor`) to make consumption copy-paste friendly without inline style objects.
- 1.11.1: Removed redundant `tone` APIs in favor of `color` presets (extensible for future preset bundles).
- 1.11.2: Generated the Semantic Overrides docs snippet from the same spec driving the specimen to prevent drift and standardized semantic labels to title case.
- 1.11.3: Simplified the Semantic Overrides story to a single explicit example list while still deriving the docs snippet from the rendered specimen data.
- 1.11.4: Moved Button multi-example layouts (disabled, sizes, full-width) into Storybook decorators so docs snippets show copy-pasteable `<Button />` instances instead of layout wrappers or args spreads.
- 1.11.5: Removed the Semantic Overrides manual docs source constant by using a decorator-based grid layout with Storybook dynamic source generation.
- 1.11.6: Updated React Storybook controls so `surfaceColor`, `borderColor`, `textColor`, `leadingIconName`, and `trailingIconName` use token/icon dropdowns with explicit defaults.
- 1.11.7: Updated button state-layer styling to tint hover/active overlays from `surfaceColor` while keeping focus overlays pinned to the primary accent, and refreshed style-generation tests.
- 1.11.8: Made state-layer tint source variant-aware (`surface` for primary, `border` for secondary, `text` for tertiary) so hover/active colors remain expressive across all variants.
- 1.11.9: Corrected hover/active color-mix ordering to weight the variant tint color first, aligning rendered hover states with expected intensity behavior.
- 1.11.10: Split hover/active mix ordering by variant so primary keeps layer-first blending while secondary/tertiary use tint-first blending.
- 1.11.11: Replaced hardcoded Storybook color option arrays with shared generated token options sourced from `@styles/themes/storybook-token-options.generated`.
