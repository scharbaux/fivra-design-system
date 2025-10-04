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
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Maps to variant tokens listed above. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Adjusts typography, padding, and icon spacing tokens. |
| `fullWidth` | `boolean` | `false` | Sets `data-full-width` and expands to container width. |
| `leadingIcon` | `React.ReactNode` | `undefined` | Rendered with `aria-hidden="true"` before the label. |
| `trailingIcon` | `React.ReactNode` | `undefined` | Rendered with `aria-hidden="true"` after the label. |
| `iconOnly` | `boolean` | `false` | Applies max radius and enforces accessible naming. |
| `hasLabel` | `boolean` | `undefined` | Overrides automatic label detection when using visually hidden copy. |
| `dropdown` | `boolean` | `false` | Adds caret indicator and toggles disclosure data attributes. |
| `loading` | `boolean` | `false` | Shows spinner, sets `aria-busy`, and disables clicks. |
| `...buttonProps` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | – | Native button attributes (`type`, `disabled`, etc.). |

#### Angular (`<fivra-button>`)

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Mirrors React variant behavior. |
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
| `variant` | `primary \| secondary \| tertiary` | `primary` | Controls variant tokens. |
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
