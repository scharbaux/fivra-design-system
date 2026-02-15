# Button

The Button component exposes an accessible, themeable action trigger implemented both as a React component and as a standards-based custom element. Styles, variants, and sizing tokens are shared across targets so teams can mix frameworks without visual drift.
React and Vue Storybook adapters compose the Box primitive as their structural wrapper so layout/reset behavior stays consistent with other primitives.

Refer to the [Button component contract](../../src/components/Button/AGENTS.md#component-contract) for the authoritative list of variants, sizes, accessibility requirements, and framework-specific props. Update that contract alongside this page when behavior shifts.

- Source: [`src/components/Button/Button.tsx`](../../src/components/Button/Button.tsx)
- Stories: [`src/components/Button/Button.stories.tsx`](../../src/components/Button/Button.stories.tsx)
- Custom element: [`src/web-components/button.ts`](../../src/web-components/button.ts)

## React usage

```tsx
import { Button } from '@fivra/design-system';

export function SaveButton() {
  return (
    <Button
      variant="primary"
      size="md"
      leadingIconName="check"
      label="Save changes"
      onClick={() => console.log('Saved!')}
    />
  );
}
```

### Semantic palettes

```tsx
<Button variant="primary" color="primary-success" label="Success Primary" />
<Button variant="secondary" color="primary-success" label="Success Secondary" />
<Button variant="tertiary" color="primary-success" label="Success Tertiary" />
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | `undefined` | Visible label content. Prefer this for straightforward usage. |
| `children` | `React.ReactNode` | `undefined` | Advanced: custom content. When provided, it takes precedence over `label`. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `primary` | Chooses the visual treatment mapped to `--background-primary-interactive`, `--background-neutral-0`, or a transparent tertiary surface. |
| `color` | `'primary-success' \| 'primary-warning' \| 'primary-error'` | `undefined` | Semantic palette alias. Prefer this for copy-paste examples. |
| `surfaceColor` | `string` | `undefined` | Overrides `--fivra-button-surface` using a design token string (e.g., `background-primary-success`). |
| `borderColor` | `string` | `undefined` | Overrides `--fivra-button-border` using a design token string (e.g., `border-primary-success`). |
| `textColor` | `string` | `undefined` | Overrides `--fivra-button-text` using a design token string (e.g., `text-primary-success`). |
| `accentColor` | `string` | `undefined` | Overrides `--fivra-button-accent` using a design token string (drives state layers). |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` | Adjusts typography, padding, and icon spacing. |
| `fullWidth` | `boolean` | `false` | When `true`, sets the button width to 100% of its container. |
| `leadingIcon` | `React.ReactNode` | `undefined` | Optional icon rendered before the label with `aria-hidden`. |
| `leadingIconName` | `string` | `undefined` | Convenience: renders the shared Icon before the label (uses `currentColor`). |
| `trailingIcon` | `React.ReactNode` | `undefined` | Optional icon rendered after the label with `aria-hidden`. |
| `trailingIconName` | `string` | `undefined` | Convenience: renders the shared Icon after the label (uses `currentColor`). |
| `iconOnly` | `boolean` | `false` | Removes the visible label, switches to `--radius-max`, and requires an accessible name via `aria-label`/`aria-labelledby`. |
| `hasLabel` | `boolean` | `undefined` | Overrides automatic label detection when providing off-screen copy or live region text. |
| `dropdown` | `boolean` | `false` | Appends a disclosure caret to hint at menu/split button behavior. |
| `loading` | `boolean` | `false` | Displays the centered spinner and sets `aria-busy` on the button. |
| `...buttonProps` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | – | Native button attributes such as `type`, `disabled`, `aria-pressed`, etc. |

The component defaults `type="button"` to avoid accidental form submissions. Provide `type="submit"` or `type="reset"` when integrating with forms.

## Angular usage

```ts
import { NgModule } from '@angular/core';
import { FivraButtonModule } from '@fivra/design-system/angular';

@NgModule({
  imports: [FivraButtonModule],
})
export class ButtonsModule {}
```

```html
<fivra-button
  variant="secondary"
  size="lg"
  [leadingIcon]="leadingIcon"
  [dropdown]="true"
  ariaLabel="Invite collaborators"
>
  Invite collaborators
  <span fivraButtonTrailingIcon aria-hidden="true">
    <app-icon name="chevron-down"></app-icon>
  </span>
</fivra-button>

<ng-template #leadingIcon>
  <app-icon name="user-plus" aria-hidden="true"></app-icon>
</ng-template>
```

Angular bindings mirror the React props:

- `label`, `variant`, `color`, `surfaceColor`, `borderColor`, `textColor`, `accentColor`, `size`, `fullWidth`, `iconOnly`, `hasLabel`, `dropdown`, `loading`, `type`, and `disabled` map to the same behaviors and data attributes as the React/web component implementations.
- Pass projected icons with the `fivraButtonLeadingIcon`/`fivraButtonTrailingIcon` directives or provide an `ng-template` via the `[leadingIcon]`/`[trailingIcon]` inputs.
- The component exposes `focus()` and `click()` methods that proxy to the underlying `<button>` to simplify programmatic control.
- Set `ariaLabel`/`ariaLabelledby` for icon-only buttons to maintain accessible names.

## Custom element

The same implementation ships as `<fivra-button>`. Register it once at app startup:

```ts
import { defineFivraButton } from '@fivra/design-system/web-components';

defineFivraButton();
```

Then use the element in any framework or plain HTML:

```html
<fivra-button variant="secondary" size="lg">
  <span slot="leading-icon" aria-hidden="true">🔗</span>
  Invite collaborators
</fivra-button>
```

Slots:

- `slot="leading-icon"` – optional leading visual (icons, spinners).
- default slot – button label.
- `slot="trailing-icon"` – optional trailing visual.

Attributes mirror the React props (`label`, `variant`, `color`, `surface-color`, `border-color`, `text-color`, `accent-color`, `size`, `full-width`, `disabled`, `type`, `icon-only`, `has-label`, `dropdown`, `loading`). The element forwards `click`, `focus`, and `blur` behaviors to the internal `<button>` for accessibility.

## Accessibility

- Focus styles use a high-contrast ring and respect `:focus-visible`.
- Disabled buttons apply `aria-disabled="true"` in addition to the native `disabled` attribute inside the custom element.
- Icon wrappers set `aria-hidden="true"` so decorative glyphs do not duplicate the label for screen readers.

## Theming

Design tokens are surfaced as CSS variables on the button root (e.g., `--background-primary-interactive`, `--background-primary-disabled`, `--text-primary-interactive`). Override them at the component or global level to align with product branding.

```css
.my-theme {
  --background-primary-interactive: #7c3aed;
  --background-primary-disabled: #cbd5f5;
  --text-primary-interactive: #ffffff;
}
```

Wrap the Button with `.my-theme` (or apply on the `body`) to customize colors while keeping typography and spacing consistent.
