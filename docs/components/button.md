# Button

The Button component exposes an accessible, themeable action trigger implemented as React, Angular, and standards-based custom-element adapters. Styles, variants, and sizing tokens are shared across targets so teams can mix frameworks without visual drift.

- Source: [`src/components/Button/Button.tsx`](../../src/components/Button/Button.tsx)
- Stories: [`src/components/Button/Button.stories.tsx`](../../src/components/Button/Button.stories.tsx)
- Custom element: [`src/web-components/button.ts`](../../src/web-components/button.ts)
- Angular module: [`src/angular/button/fivra-button.module.ts`](../../src/angular/button/fivra-button.module.ts)
- Angular component: [`src/angular/button/fivra-button.component.ts`](../../src/angular/button/fivra-button.component.ts)

## React usage

```tsx
import { Button } from '@fivra/design-system';
import { Icon } from '@fivra/design-system';

export function SaveButton() {
  return (
    <Button
      variant="primary"
      size="md"
      leadingIcon={<Icon name="check" variant="solid" aria-hidden="true" />}
      onClick={() => console.log('Saved!')}
    >
      Save changes
    </Button>
  );
}
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `primary` | Chooses the visual treatment mapped to `--backgroundPrimaryInteractive`, `--backgroundNeutral0`, or a transparent tertiary surface. |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` | Adjusts typography, padding, and icon spacing. |
| `fullWidth` | `boolean` | `false` | When `true`, sets the button width to 100% of its container. |
| `leadingIcon` | `React.ReactNode` | `undefined` | Optional icon rendered before the label with `aria-hidden`. |
| `trailingIcon` | `React.ReactNode` | `undefined` | Optional icon rendered after the label with `aria-hidden`. |
| `iconOnly` | `boolean` | `false` | Removes the visible label, switches to `--radiusMax`, and requires an accessible name via `aria-label`/`aria-labelledby`. |
| `hasLabel` | `boolean` | `undefined` | Overrides automatic label detection when providing off-screen copy or live region text. |
| `dropdown` | `boolean` | `false` | Appends a disclosure caret to hint at menu/split button behavior. |
| `loading` | `boolean` | `false` | Displays the centered spinner and sets `aria-busy` on the button. |
| `...buttonProps` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | – | Native button attributes such as `type`, `disabled`, `aria-pressed`, etc. |

The component defaults `type="button"` to avoid accidental form submissions. Provide `type="submit"` or `type="reset"` when integrating with forms.

## Angular usage

Import the Angular module once per feature shell and leverage either template inputs (`[leadingIcon]`, `[trailingIcon]`) or projection directives (`fivraButtonLeadingIcon`, `fivraButtonTrailingIcon`) to mirror the React API:

```ts
import { Component } from '@angular/core';
import { FivraButtonModule } from 'fivra-design-system/angular';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [FivraButtonModule],
  template: `
    <ng-template #downloadIcon>
      <fivra-icon name="download"></fivra-icon>
    </ng-template>

    <fivra-button
      variant="secondary"
      size="lg"
      [leadingIcon]="downloadIcon"
      dropdown
      ariaLabel="Export report"
    >
      Export
      <fivra-icon fivraButtonTrailingIcon name="chevron-down"></fivra-icon>
    </fivra-button>
  `,
})
export class ExportButtonComponent {}
```

### Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `primary` | Matches the React/Web Component variants. |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` | Scales padding, height, icon sizing, and typography. |
| `fullWidth` | `boolean` | `false` | Expands the button to fill its container. |
| `iconOnly` | `boolean` | `false` | Collapses padding, applies pill radii, and requires an accessible name (`ariaLabel`/`ariaLabelledby`). |
| `hasLabel` | `boolean` | `undefined` | Overrides automatic label detection when projecting visually hidden content. |
| `dropdown` | `boolean` | `false` | Shows the disclosure caret. |
| `loading` | `boolean` | `false` | Displays the centered spinner and applies `aria-busy`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `button` | Native button type forwarded to the inner `<button>`. |
| `disabled` | `boolean` | `false` | Disables the inner `<button>`. |
| `ariaLabel` | `string` | `null` | Sets `aria-label` on the inner `<button>`. |
| `ariaLabelledby` | `string` | `null` | Sets `aria-labelledby` on the inner `<button>`. |
| `leadingIcon` | `TemplateRef` | `undefined` | Optional icon rendered before the label. |
| `trailingIcon` | `TemplateRef` | `undefined` | Optional icon rendered after the label. |

The component also exposes imperative `focus()` and `click()` helpers that delegate to the internal `<button>`—useful for menu triggers.

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

Attributes mirror the React props (`variant`, `size`, `full-width`, `disabled`, `type`, `icon-only`, `has-label`, `dropdown`, `loading`). The element forwards `click`, `focus`, and `blur` behaviors to the internal `<button>` for accessibility.

## Accessibility

- Focus styles use a high-contrast ring and respect `:focus-visible`.
- Disabled buttons apply `aria-disabled="true"` in addition to the native `disabled` attribute inside the custom element.
- Icon wrappers set `aria-hidden="true"` so decorative glyphs do not duplicate the label for screen readers.

## Theming

Design tokens are surfaced as CSS variables on the button root (e.g., `--backgroundPrimaryInteractive`, `--backgroundPrimaryDisabled`, `--textPrimaryInteractive`). Override them at the component or global level to align with product branding.

```css
.my-theme {
  --backgroundPrimaryInteractive: #7c3aed;
  --backgroundPrimaryDisabled: #cbd5f5;
  --textPrimaryInteractive: #ffffff;
}
```

Wrap the Button with `.my-theme` (or apply on the `body`) to customize colors while keeping typography and spacing consistent.
