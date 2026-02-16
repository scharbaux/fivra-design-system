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
  "--fivra-button-surface": `var(--background-primary${tone})`,
  "--fivra-button-accent": `var(--background-primary${tone})`,
  "--fivra-button-border": `var(--border-primary${tone})`,
  "--fivra-button-text": "var(--background-neutral-0)",
  "--fivra-button-hover-fallback": `var(--background-primary${tone})`,
  "--fivra-button-active-fallback": `var(--background-primary${tone})`,
});

const createSecondaryOverrides = (
  tone: SemanticTone,
): SemanticStyleOverrides => ({
  "--fivra-button-accent": `var(--text-primary${tone})`,
  "--fivra-button-border": `var(--border-primary${tone})`,
  "--fivra-button-text": `var(--text-primary${tone})`,
  "--fivra-button-hover-fallback": `var(--background-secondary${tone})`,
  "--fivra-button-active-fallback": `var(--background-secondary${tone})`,
});

const createTertiaryOverrides = (
  tone: SemanticTone,
): SemanticStyleOverrides => ({
  "--fivra-button-accent": `var(--text-primary${tone})`,
  "--fivra-button-text": `var(--text-primary${tone})`,
  "--fivra-button-hover-fallback": `var(--background-secondary${tone})`,
  "--fivra-button-active-fallback": `var(--background-secondary${tone})`,
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
