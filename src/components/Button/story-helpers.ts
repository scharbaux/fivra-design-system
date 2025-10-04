export const SEMANTIC_TONES = ["Success", "Warning", "Error"] as const;

export type SemanticTone = (typeof SEMANTIC_TONES)[number];

export type SemanticStyleOverrides = Record<string, string>;

export type SemanticStyleFactory<TStyles> = (tone: SemanticTone) => TStyles;

export type ButtonSemanticStyleFactories<TStyles> = {
  createPrimarySemanticStyles: SemanticStyleFactory<TStyles>;
  createSecondarySemanticStyles: SemanticStyleFactory<TStyles>;
  createTertiarySemanticStyles: SemanticStyleFactory<TStyles>;
};

const createPrimaryOverrides = (tone: SemanticTone): SemanticStyleOverrides => ({
  "--fivra-button-surface": `var(--backgroundPrimary${tone})`,
  "--fivra-button-accent": `var(--backgroundPrimary${tone})`,
  "--fivra-button-border": `var(--borderPrimary${tone})`,
  "--fivra-button-text": "var(--backgroundNeutral0)",
  "--fivra-button-hover-fallback": `var(--backgroundPrimary${tone})`,
  "--fivra-button-active-fallback": `var(--backgroundPrimary${tone})`,
});

const createSecondaryOverrides = (
  tone: SemanticTone,
): SemanticStyleOverrides => ({
  "--fivra-button-accent": `var(--textPrimary${tone})`,
  "--fivra-button-border": `var(--borderPrimary${tone})`,
  "--fivra-button-text": `var(--textPrimary${tone})`,
  "--fivra-button-hover-fallback": `var(--backgroundSecondary${tone})`,
  "--fivra-button-active-fallback": `var(--backgroundSecondary${tone})`,
});

const createTertiaryOverrides = (
  tone: SemanticTone,
): SemanticStyleOverrides => ({
  "--fivra-button-accent": `var(--textPrimary${tone})`,
  "--fivra-button-text": `var(--textPrimary${tone})`,
  "--fivra-button-hover-fallback": `var(--backgroundSecondary${tone})`,
  "--fivra-button-active-fallback": `var(--backgroundSecondary${tone})`,
});

export function createButtonSemanticStyleFactories(): ButtonSemanticStyleFactories<SemanticStyleOverrides>;
export function createButtonSemanticStyleFactories<TStyles>(
  mapOverrides: (overrides: SemanticStyleOverrides) => TStyles,
): ButtonSemanticStyleFactories<TStyles>;
export function createButtonSemanticStyleFactories<TStyles>(
  mapOverrides: (overrides: SemanticStyleOverrides) => TStyles = (overrides) =>
    overrides as unknown as TStyles,
): ButtonSemanticStyleFactories<TStyles> {
  return {
    createPrimarySemanticStyles: (tone) => mapOverrides(createPrimaryOverrides(tone)),
    createSecondarySemanticStyles: (tone) => mapOverrides(createSecondaryOverrides(tone)),
    createTertiarySemanticStyles: (tone) => mapOverrides(createTertiaryOverrides(tone)),
  };
}
