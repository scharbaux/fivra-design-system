const DEFAULT_COLOR_SPACE = 'srgb';
export const COLOR_MIX_SUPPORTS_DECLARATION =
  'color: color-mix(in srgb, #000 0%, #fff 100%)';

interface ColorMixOptions {
  layerColor: string;
  layerPercentage: string;
  accentColor: string;
  colorSpace?: string;
}

export function colorMix({
  layerColor,
  layerPercentage,
  accentColor,
  colorSpace = DEFAULT_COLOR_SPACE,
}: ColorMixOptions): string {
  return `color-mix(in ${colorSpace}, ${layerColor} ${layerPercentage}, ${accentColor})`;
}
