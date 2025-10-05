const BOX_STYLE_ATTRIBUTE = 'data-fivra-box-styles';

export const BOX_CLASS_NAME = 'fivra-box';

export const BOX_SPACING_TOKENS = [
  'spacing-xs-3',
  'spacing-xs-2',
  'spacing-xs',
  'spacing-s',
  'spacing-m',
  'spacing-l',
  'spacing-xl',
  'spacing-xl-2',
  'spacing-xl-3',
  'spacing-xl-4',
] as const;

export type BoxSpacingToken = (typeof BOX_SPACING_TOKENS)[number];

export const BOX_RADIUS_TOKENS = [
  'radius-none',
  'radius-xs-2',
  'radius-xs',
  'radius-s',
  'radius-m',
  'radius-l',
  'radius-xl',
  'radius-max',
] as const;

export type BoxRadiusToken = (typeof BOX_RADIUS_TOKENS)[number];

export const BOX_BORDER_WIDTH_TOKENS = [
  'border-width-none',
  'border-width-s',
  'border-width-sm',
  'border-width-m',
  'border-width-l',
  'border-width-xl',
] as const;

export type BoxBorderWidthToken = (typeof BOX_BORDER_WIDTH_TOKENS)[number];

const BOX_BASE_STYLES = `.${BOX_CLASS_NAME} {\n  box-sizing: border-box;\n  min-width: 0;\n  min-height: 0;\n}`;

let hasInjectedBoxStyles = false;

export function ensureBoxStyles(): void {
  if (hasInjectedBoxStyles || typeof document === 'undefined') {
    return;
  }

  const existing = document.querySelector(`style[${BOX_STYLE_ATTRIBUTE}="true"]`);
  if (existing) {
    hasInjectedBoxStyles = true;
    return;
  }

  const style = document.createElement('style');
  style.setAttribute(BOX_STYLE_ATTRIBUTE, 'true');
  style.textContent = BOX_BASE_STYLES;
  document.head.appendChild(style);
  hasInjectedBoxStyles = true;
}

export { BOX_STYLE_ATTRIBUTE, BOX_BASE_STYLES };
