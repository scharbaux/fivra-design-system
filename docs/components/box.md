# Box

Box provides a token-aware layout primitive for spacing, background, and alignment utilities. It forwards refs, respects polymorphic `as` overrides, and injects a single reset stylesheet so every framework adapter shares the same baseline (`box-sizing: border-box`, `min-width: 0`, `min-height: 0`).

Review the [Box component contract](../../src/components/Box/AGENTS.md#component-contract) for the authoritative prop list and governance details. Keep this reference aligned with Storybook examples and implementation updates.

- Source: [`src/components/Box/Box.tsx`](../../src/components/Box/Box.tsx)
- Styles: [`src/components/Box/box.styles.ts`](../../src/components/Box/box.styles.ts)
- React stories: [`src/components/Box/Box.stories.tsx`](../../src/components/Box/Box.stories.tsx)
- Vue stories: [`storybooks/vue/src/stories/Box.stories.ts`](../../storybooks/vue/src/stories/Box.stories.ts)

## React usage

```tsx
import { Box } from '@fivra/design-system';

export function SummaryCard() {
  return (
    <Box
      as="section"
      aria-labelledby="summary-heading"
      backgroundColor="background-neutral-0"
      borderRadius="radius-l"
      p="spacing-l"
      display="grid"
      gap="spacing-m"
    >
      <Box as="h2" id="summary-heading" style={{ margin: 0 }}>
        Account summary
      </Box>
      <Box color="text-neutral-2">
        Use spacing tokens (e.g., `spacing-m`) to create consistent gutters without hardcoding pixel values.
      </Box>
      <Box display="flex" gap="spacing-s" justifyContent="flex-end">
        <Box
          as="button"
          type="button"
          backgroundColor="background-primary-interactive"
          color="background-neutral-0"
          px="spacing-m"
          py="spacing-s"
          borderRadius="radius-s"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          Update
        </Box>
        <Box
          as="button"
          type="button"
          backgroundColor="background-neutral-0"
          color="text-neutral-2"
          px="spacing-m"
          py="spacing-s"
          borderRadius="radius-s"
          borderWidth="border-width-s"
          style={{ borderStyle: 'solid', cursor: 'pointer' }}
        >
          Dismiss
        </Box>
      </Box>
    </Box>
  );
}
```

### Props

| Prop | Type | Description |
| --- | --- | --- |
| `as` | `React.ElementType` | Overrides the rendered element. Defaults to `<div>` when unspecified. |
| `display` | `React.CSSProperties['display']` | Sets layout mode (`flex`, `grid`, etc.). |
| `flexDirection`, `justifyContent`, `alignItems`, `flexWrap` | `React.CSSProperties[...]` | Direct pass-through to the matching CSS flexbox properties. |
| `gap`, `rowGap`, `columnGap` | `BoxSpacingToken \| number \| string` | Applies spacing tokens such as `spacing-m`, numeric pixel values, or raw CSS lengths. |
| `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` | `BoxSpacingToken \| number \| string` | Padding shorthands. Axis (`px`, `py`) and side props override broader settings. |
| `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` | `BoxSpacingToken \| number \| string` | Margin shorthands with the same precedence rules as padding. |
| `backgroundColor`, `color`, `borderColor` | `string` | Accept Engage token strings like `background-neutral-0` or raw CSS values. Tokens become `var(--token-name)` references. |
| `borderRadius` | `BoxRadiusToken \| number \| string` | Maps radius tokens (`radius-m`) to `var(--radius-m)` or accepts custom values. |
| `borderWidth` | `BoxBorderWidthToken \| number \| string` | Converts border width tokens (`border-width-s`) to `calc(var(--borderwidth-s) * 1px)` or forwards raw CSS. |
| `boxShadow` | `string` | Optional shadow token (e.g., `shadow-m`) or raw CSS shadow declaration. |
| `width`, `height` | `BoxSpacingToken \| number \| string` | Accept spacing tokens, numbers (pixels), or raw CSS for dimensions. |
| `style` | `React.CSSProperties` | Inline overrides merged after token resolution so author styles win. |
| `...boxProps` | `React.ComponentPropsWithoutRef<T>` | Native attributes for the chosen element (`id`, `role`, event handlers, etc.). |

## Accessibility

- Box does not assign implicit roles; choose the correct `as` element (e.g., `<section>`, `<nav>`, `<button>`) for semantics.
- Ensure interactive children meet focus and labeling requirements when using Box as a structural wrapper.
- Base resets include `box-sizing: border-box`, preventing overflow issues when padding is applied across nested layouts.

## Theming

Box relies on Engage CSS custom properties for background, text, radius, border width, and spacing scales. Override tokens at the theme or container scope to restyle composed layouts without changing component code.

```css
.dashboard-shell {
  --background-neutral-0: #1d1a2b;
  --text-neutral-1: #f7f7f8;
  --spacing-l: 20;
  --radius-l: 18;
}
```

Wrap your feature area with `.dashboard-shell` (or switch `data-fivra-theme`) so the updated token values cascade into every Box instance.

## Vue parity

Vue Storybook uses the same Box token-resolution pipeline (`createBoxStyles`) and mirrors the React docs controls/argTypes so API behavior stays aligned across frameworks.

### Vue Storybook adapter snippet

```vue
<template>
  <FivraBoxPreview
    as="section"
    backgroundColor="background-neutral-0"
    borderRadius="radius-l"
    p="spacing-l"
    display="grid"
    gap="spacing-m"
  >
    <FivraBoxPreview as="h2" style="margin: 0">
      Account summary
    </FivraBoxPreview>
    <FivraBoxPreview color="text-neutral-2">
      Use spacing tokens (for example, <code>spacing-m</code>) for consistent gutters.
    </FivraBoxPreview>
  </FivraBoxPreview>
</template>
```

### Story IDs used for cross-framework verification

- React: `atomics-box-react--padding-and-margin-tokens`, `atomics-box-react--flex-alignment`, `atomics-box-react--background-utilities`, `atomics-box-react--nested-composition`
- Vue: `atomics-box-vue--padding-and-margin-tokens`, `atomics-box-vue--flex-alignment`, `atomics-box-vue--background-utilities`, `atomics-box-vue--nested-composition`
