# Button

The Button component exposes an accessible, themeable action trigger implemented both as a React component and as a standards-based custom element. Styles, variants, and sizing tokens are shared across targets so teams can mix frameworks without visual drift.

- Source: [`src/components/Button/Button.tsx`](../../src/components/Button/Button.tsx)
- Stories: [`src/components/Button/Button.stories.tsx`](../../src/components/Button/Button.stories.tsx)
- Custom element: [`src/web-components/button.ts`](../../src/web-components/button.ts)

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
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `primary` | Chooses the visual treatment: filled, outlined, or subtle. |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` | Adjusts typography, padding, and icon spacing. |
| `fullWidth` | `boolean` | `false` | When `true`, sets the button width to 100% of its container. |
| `leadingIcon` | `React.ReactNode` | `undefined` | Optional icon rendered before the label with `aria-hidden`. |
| `trailingIcon` | `React.ReactNode` | `undefined` | Optional icon rendered after the label with `aria-hidden`. |
| `...buttonProps` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | – | Native button attributes such as `type`, `disabled`, `aria-pressed`, etc. |

The component defaults `type="button"` to avoid accidental form submissions. Provide `type="submit"` or `type="reset"` when integrating with forms.

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

Attributes mirror the React props (`variant`, `size`, `full-width`, `disabled`, `type`). The element forwards `click`, `focus`, and `blur` behaviors to the internal `<button>` for accessibility.

## Accessibility

- Focus styles use a high-contrast ring and respect `:focus-visible`.
- Disabled buttons apply `aria-disabled="true"` in addition to the native `disabled` attribute inside the custom element.
- Icon wrappers set `aria-hidden="true"` so decorative glyphs do not duplicate the label for screen readers.

## Theming

Design tokens are surfaced as CSS variables on the button root (e.g., `--fivra-button-primary-bg`). Override them at the component or global level to align with product branding.

```css
.my-theme {
  --fivra-button-primary-bg: #7c3aed;
  --fivra-button-primary-bg-hover: #6d28d9;
  --fivra-button-focus-ring: 0 0 0 4px rgba(124, 58, 237, 0.35);
}
```

Wrap the Button with `.my-theme` (or apply on the `body`) to customize colors while keeping typography and spacing consistent.
