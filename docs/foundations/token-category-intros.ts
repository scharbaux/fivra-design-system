export interface TokenCategoryIntro {
  title: string;
  body: string;
  guidance?: string;
}

export const CATEGORY_INTROS: Record<string, TokenCategoryIntro> = {
  all: {
    title: 'Semantic Foundations',
    body: 'Use theme and category filters to inspect semantic contracts first, then trace each token to alias and resolved values.',
    guidance: 'Tip: combine diff + issues filters to review recent token syncs quickly.',
  },
  Background: {
    title: 'Background Tokens',
    body: 'Surface and layer fills for panels, cards, interactive containers, and semantic states.',
    guidance: 'Prefer semantic background tiers over direct palette aliases in component code.',
  },
  Border: {
    title: 'Border Tokens',
    body: 'Outlines, separators, and semantic stroke colors that support hierarchy and status.',
    guidance: 'Match border semantics with paired text/background intent for accessibility.',
  },
  Text: {
    title: 'Text Tokens',
    body: 'Foreground copy colors for primary content, supporting text, and semantic messaging.',
    guidance: 'Validate contrast pairings with the a11y helper before adopting new combinations.',
  },
  State: {
    title: 'State Layer Tokens',
    body: 'Overlay colors used for focus, hover, drag, and pressed interactions.',
    guidance: 'These are often alpha-based; validate appearance over representative surfaces.',
  },
  Spacing: {
    title: 'Spacing Tokens',
    body: 'Spacing scale for gaps, margins, paddings, and layout rhythm.',
    guidance: 'Use the canonical scale to avoid one-off spacing values.',
  },
  Borderwidth: {
    title: 'Border Width Tokens',
    body: 'Stroke thickness presets for outlines and separators.',
  },
  Radius: {
    title: 'Radius Tokens',
    body: 'Corner roundness scale for surfaces and controls.',
  },
  Iconsizes: {
    title: 'Icon Size Tokens',
    body: 'Canonical icon dimensions across compact and expressive UI contexts.',
  },
  shadows: {
    title: 'Shadow Tokens',
    body: 'Elevation presets defining ambient/depth behavior.',
  },
  typography: {
    title: 'Typography Tokens',
    body: 'Composite type styles that bundle family, weight, size, line-height, and spacing.',
  },
  intensity: {
    title: 'Intensity Tokens',
    body: 'Opacity/intensity values used by state overlays and dynamic emphasis.',
  },
};

export function getCategoryIntro(category: string): TokenCategoryIntro {
  return CATEGORY_INTROS[category] ?? {
    title: `${category} Tokens`,
    body: 'Semantic token category imported from the latest source-of-truth bundle.',
  };
}
