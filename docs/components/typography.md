# Typography

Typography exposes a token-backed text primitive that forwards semantic defaults, truncation helpers, and native HTML attributes. The React implementation centralizes CSS injection so Angular and Vue adapters can share the same custom properties without duplicating styles.

Refer to the [Typography component contract](../../src/components/Typography/AGENTS.md#component-contract) for authoritative API details and cross-framework notes. Align updates here with Storybook examples and implementation changes.

- Source: [`src/components/Typography/Typography.tsx`](../../src/components/Typography/Typography.tsx)
- Styles: [`src/components/Typography/typography.styles.ts`](../../src/components/Typography/typography.styles.ts)
- Stories: [`src/components/Typography/Typography.stories.tsx`](../../src/components/Typography/Typography.stories.tsx)

## React usage

```tsx
import { Typography } from '@fivra/design-system';

export function BillingSummary() {
  return (
    <section aria-labelledby="billing-heading">
      <Typography id="billing-heading" variant="heading-2">
        Billing summary
      </Typography>
      <Typography variant="body-2-long">
        Charges settle on the first business day of each month. Updates apply to the next billing cycle.
      </Typography>
      <Typography variant="body-2-link" as="a" href="/billing/preferences">
        Manage payment preferences
      </Typography>
    </section>
  );
}
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `TypographyVariant` | `'body-1'` | Maps text styling to Engage tokens (`--heading1FontSize`, `--body2LetterSpacing`, etc.). |
| `truncate` | `boolean` | `false` | Adds `data-truncate="true"` to apply ellipsis overflow handling. |
| `noWrap` | `boolean` | `false` | Prevents line wrapping by setting `white-space: nowrap` via `data-nowrap`. |
| `as` | `React.ElementType` | Semantic default per variant | Overrides the rendered element. Headings default to `<h1>`–`<h3>`, body variants use `<p>`, and captions render `<span>`. |
| `...typographyProps` | `React.ComponentPropsWithoutRef<T>` | – | Native attributes for the chosen element (e.g., `href` for anchors, `id`, `className`). |

### Variants

| Variant | Default element | Tokens |
| --- | --- | --- |
| `heading-1` | `<h1>` | `--heading1FontFamily`, `--heading1FontSize`, `--heading1FontWeight`, `--heading1LineHeight` |
| `heading-2` | `<h2>` | `--heading2*` tokens |
| `heading-3` | `<h3>` | `--heading3*` tokens |
| `body-1` | `<p>` | `--body1*` tokens |
| `body-1-medium` | `<p>` | `--body1Medium*` tokens |
| `body-1-strong` | `<p>` | `--body1Strong*` tokens |
| `body-2` | `<p>` | `--body2*` tokens |
| `body-2-strong` | `<p>` | `--body2Strong*` tokens |
| `body-2-link` | `<p>` | `--body2Link*` tokens and `--textPrimaryInteractive` color |
| `body-2-long` | `<p>` | `--body2Long*` tokens |
| `body-3` | `<p>` | `--body3*` tokens |
| `caption-1` | `<span>` | `--caption1*` tokens |
| `caption-1-strong` | `<span>` | `--caption1Strong*` tokens |

## Accessibility

- Headings default to semantic `<h1>`–`<h3>` elements so screen readers announce proper hierarchy. Override `as` when the document outline requires a different level.
- Truncation applies `aria-hidden`-safe styling only; provide tooltips or expanded views when critical information is truncated.
- Link-styled variants default to `<p>` to avoid empty anchors. Supply `as="a"` with an `href` when the copy represents an interactive link.

## Theming

The component reads Engage custom properties such as `--heading1FontFamily`, `--body2FontSize`, and `--textNeutral1`. Override these tokens at the theme or container scope to adjust typography across frameworks without changing component code.

```css
.marketing-theme {
  --heading1FontSize: 32px;
  --heading1FontWeight: 700;
  --body2LetterSpacing: 0.02em;
  --textNeutral1: #1c1932;
}
```

Apply `.marketing-theme` to a container or root element to cascade new token values into Typography instances.
