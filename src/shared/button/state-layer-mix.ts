const DEFAULT_COLOR_SPACE = 'srgb';

export const COLOR_MIX_SUPPORTS_DECLARATION =
  'color: color-mix(in srgb, #000 0%, #fff 100%)';

interface ColorMixOptions {
  layerColor: string;
  layerPercentage: string;
  accentColor: string;
  colorSpace?: string;
  weightTarget?: 'layer' | 'accent';
}

function colorMix({
  layerColor,
  layerPercentage,
  accentColor,
  colorSpace = DEFAULT_COLOR_SPACE,
  weightTarget = 'layer',
}: ColorMixOptions): string {
  const operands =
    weightTarget === 'accent'
      ? `${layerColor}, ${accentColor} ${layerPercentage}`
      : `${layerColor} ${layerPercentage}, ${accentColor}`;

  return `color-mix(in ${colorSpace}, ${operands})`;
}

interface InteractiveStateLayerMixOptions {
  tintColor: string;
  focusColor?: string;
  layerColor?: string;
  hoverPercentage?: string;
  activePercentage?: string;
  focusPercentage?: string;
  interactionOrder?: 'layer-first' | 'tint-first';
}

interface InteractiveStateLayerMixes {
  hoverColor: string;
  activeColor: string;
  focusRingColor: string;
  hoverHalo: string;
  activeHalo: string;
  focusHalo: string;
}

export function createInteractiveStateLayerMixes({
  tintColor,
  focusColor = tintColor,
  layerColor = 'var(--stateLayerBrightenBase)',
  hoverPercentage = 'var(--intensityBrandHoverPercent)',
  activePercentage = 'var(--intensityBrandActivePercent)',
  focusPercentage = 'var(--intensityBrandFocusPercent)',
  interactionOrder = 'tint-first',
}: InteractiveStateLayerMixOptions): InteractiveStateLayerMixes {
  const hoverMix =
    interactionOrder === 'layer-first'
      ? colorMix({
          layerColor,
          layerPercentage: hoverPercentage,
          accentColor: tintColor,
          weightTarget: 'layer',
        })
      : colorMix({
          layerColor: tintColor,
          layerPercentage: hoverPercentage,
          accentColor: layerColor,
          weightTarget: 'layer',
        });

  const activeMix =
    interactionOrder === 'layer-first'
      ? colorMix({
          layerColor,
          layerPercentage: activePercentage,
          accentColor: tintColor,
          weightTarget: 'layer',
        })
      : colorMix({
          layerColor: tintColor,
          layerPercentage: activePercentage,
          accentColor: layerColor,
          weightTarget: 'layer',
        });

  return {
    hoverColor: hoverMix,
    activeColor: activeMix,
    focusRingColor: colorMix({
      layerColor,
      layerPercentage: focusPercentage,
      accentColor: focusColor,
      weightTarget: 'layer',
    }),
    hoverHalo: colorMix({
      layerColor,
      layerPercentage: hoverPercentage,
      accentColor: tintColor,
      weightTarget: 'accent',
    }),
    activeHalo: colorMix({
      layerColor,
      layerPercentage: activePercentage,
      accentColor: tintColor,
      weightTarget: 'accent',
    }),
    focusHalo: colorMix({
      layerColor,
      layerPercentage: focusPercentage,
      accentColor: focusColor,
      weightTarget: 'accent',
    }),
  };
}
