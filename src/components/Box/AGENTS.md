# Box Component Guidelines

This directory inherits the repository root `AGENTS.md` and `src/components/AGENTS.md`. Review those policies before modifying files within `src/components/Box/`.

## Component Contract
- `Box` is a polymorphic layout primitive that defaults to a `<div>` and forwards refs.
- Spacing props (`m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`, `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `gap`, `rowGap`, `columnGap`) accept raw CSS values, numbers (treated as pixels), or Engage spacing tokens formatted as `spacing-{scale}` (e.g., `spacing-xs-3` -> `calc(var(--spacingXs3) * 1px)`). Axis and side shorthands override broader settings.
- Visual tokens accept Engage hyphenated names and resolve to CSS custom properties: e.g., `background-neutral-0` -> `var(--backgroundNeutral0)`, `radius-m` -> `calc(var(--radiusM) * 1px)`, `border-width-s` -> `calc(var(--borderwidthS) * 1px)`. Raw CSS strings remain untouched.
- Layout helpers map directly to CSS properties: `display`, `flexDirection`, `justifyContent`, `alignItems`, `flexWrap`, `width`, and `height`.
- Accessibility defaults preserve author intent by avoiding implicit roles; the primitive simply renders the requested element and passes through semantics.
- `ensureBoxStyles()` injects a single reset stylesheet (`box-sizing: border-box`, `min-width: 0`, `min-height: 0`) shared across frameworks. Call it before rendering in new adapters.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0.0: Introduced the token-driven Box primitive with spacing shorthands, style injector, tests, stories, and documentation.
- 1.3.1: Fixed `borderRadius` token resolution to apply pixel units (`calc(var(--radius*) * 1px)`), aligning with spacing and border width behavior.

