import {
  BOX_BORDER_WIDTH_TOKENS,
  BOX_RADIUS_TOKENS,
  BOX_SPACING_TOKENS,
  type BoxBorderWidthToken,
  type BoxRadiusToken,
  type BoxSpacingToken,
} from './box.styles';

export type BoxSpacingValue = BoxSpacingToken | number | string;

export type BoxStyleInput = {
  // Margin helpers
  m?: BoxSpacingValue;
  mx?: BoxSpacingValue;
  my?: BoxSpacingValue;
  mt?: BoxSpacingValue;
  mr?: BoxSpacingValue;
  mb?: BoxSpacingValue;
  ml?: BoxSpacingValue;
  // Padding helpers
  p?: BoxSpacingValue;
  px?: BoxSpacingValue;
  py?: BoxSpacingValue;
  pt?: BoxSpacingValue;
  pr?: BoxSpacingValue;
  pb?: BoxSpacingValue;
  pl?: BoxSpacingValue;
  // Gap helpers
  gap?: BoxSpacingValue;
  rowGap?: BoxSpacingValue;
  columnGap?: BoxSpacingValue;
  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
  // Visual props
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: BoxRadiusToken | number | string;
  borderWidth?: BoxBorderWidthToken | number | string;
  boxShadow?: string;
  width?: BoxSpacingValue;
  height?: BoxSpacingValue;
};

type BoxResolvedStyle = Record<string, string>;

const spacingTokenSet = new Set<string>(BOX_SPACING_TOKENS);
const radiusTokenSet = new Set<string>(BOX_RADIUS_TOKENS);
const borderWidthTokenSet = new Set<string>(BOX_BORDER_WIDTH_TOKENS);

function isSpacingToken(value: string): value is BoxSpacingToken {
  return spacingTokenSet.has(value);
}

function isRadiusToken(value: string): value is BoxRadiusToken {
  return radiusTokenSet.has(value);
}

function isBorderWidthToken(value: string): value is BoxBorderWidthToken {
  return borderWidthTokenSet.has(value);
}

function toCssVariableName(token: string): string {
  return `--${token}`;
}

function toBorderWidthCssVariableName(token: string): string {
  return `--${token.replace('border-width-', 'borderwidth-')}`;
}

function isDesignToken(value: string): boolean {
  return /^[a-z]+(?:-[a-z0-9]+)+$/i.test(value);
}

function resolveSpacingValue(value: BoxSpacingValue | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    if (isSpacingToken(value) || (isDesignToken(value) && value.startsWith('spacing-'))) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    return value;
  }

  return value;
}

function resolveColorValue(value: string | undefined): string | undefined {
  if (!value) {
    return value;
  }

  if (value.startsWith('var(') || value.startsWith('calc(')) {
    return value;
  }

  if (isDesignToken(value)) {
    return `var(${toCssVariableName(value)})`;
  }

  return value;
}

function resolveRadiusValue(value: BoxStyleInput['borderRadius']): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    if (isRadiusToken(value) || (isDesignToken(value) && value.startsWith('radius-'))) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    return value;
  }

  return value;
}

function resolveBorderWidthValue(value: BoxStyleInput['borderWidth']): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    if (isBorderWidthToken(value) || (isDesignToken(value) && value.startsWith('border-width-'))) {
      return `calc(var(${toBorderWidthCssVariableName(value)}) * 1px)`;
    }

    return value;
  }

  return value;
}

function resolveDimensionValue(value: BoxSpacingValue | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    if (isSpacingToken(value) || (isDesignToken(value) && value.startsWith('spacing-'))) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    return value;
  }

  return value;
}

function resolveBoxShadowValue(value: BoxStyleInput['boxShadow']): string | undefined {
  if (!value || typeof value !== 'string') {
    return value;
  }

  if (value.startsWith('var(')) {
    return value;
  }

  if (isDesignToken(value) && value.startsWith('shadow-')) {
    const preset = value.slice('shadow-'.length);
    const normalizedPreset = preset.trim().toLowerCase();

    if (normalizedPreset) {
      return `calc(var(--shadows-${normalizedPreset}x) * 1px) calc(var(--shadows-${normalizedPreset}y) * 1px) calc(var(--shadows-${normalizedPreset}-blur) * 1px) calc(var(--shadows-${normalizedPreset}-spread) * 1px) var(--shadows-${normalizedPreset}-color)`;
    }

    return `var(${toCssVariableName(value)})`;
  }

  return value;
}

function applySpacing(style: BoxResolvedStyle, props: BoxStyleInput): void {
  const marginOrder: Array<keyof BoxStyleInput> = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'];
  const paddingOrder: Array<keyof BoxStyleInput> = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'];

  for (const key of marginOrder) {
    const value = props[key] as BoxSpacingValue | undefined;
    if (value === undefined) {
      continue;
    }

    const resolved = resolveSpacingValue(value);
    if (resolved === undefined) {
      continue;
    }

    switch (key) {
      case 'm':
        style.marginTop = resolved;
        style.marginRight = resolved;
        style.marginBottom = resolved;
        style.marginLeft = resolved;
        break;
      case 'mx':
        style.marginLeft = resolved;
        style.marginRight = resolved;
        break;
      case 'my':
        style.marginTop = resolved;
        style.marginBottom = resolved;
        break;
      case 'mt':
        style.marginTop = resolved;
        break;
      case 'mr':
        style.marginRight = resolved;
        break;
      case 'mb':
        style.marginBottom = resolved;
        break;
      case 'ml':
        style.marginLeft = resolved;
        break;
      default:
        break;
    }
  }

  for (const key of paddingOrder) {
    const value = props[key] as BoxSpacingValue | undefined;
    if (value === undefined) {
      continue;
    }

    const resolved = resolveSpacingValue(value);
    if (resolved === undefined) {
      continue;
    }

    switch (key) {
      case 'p':
        style.paddingTop = resolved;
        style.paddingRight = resolved;
        style.paddingBottom = resolved;
        style.paddingLeft = resolved;
        break;
      case 'px':
        style.paddingLeft = resolved;
        style.paddingRight = resolved;
        break;
      case 'py':
        style.paddingTop = resolved;
        style.paddingBottom = resolved;
        break;
      case 'pt':
        style.paddingTop = resolved;
        break;
      case 'pr':
        style.paddingRight = resolved;
        break;
      case 'pb':
        style.paddingBottom = resolved;
        break;
      case 'pl':
        style.paddingLeft = resolved;
        break;
      default:
        break;
    }
  }

  if (props.gap !== undefined) {
    const resolved = resolveSpacingValue(props.gap);
    if (resolved !== undefined) {
      style.gap = resolved;
    }
  }

  if (props.rowGap !== undefined) {
    const resolved = resolveSpacingValue(props.rowGap);
    if (resolved !== undefined) {
      style.rowGap = resolved;
    }
  }

  if (props.columnGap !== undefined) {
    const resolved = resolveSpacingValue(props.columnGap);
    if (resolved !== undefined) {
      style.columnGap = resolved;
    }
  }
}

export function createBoxStyles(props: BoxStyleInput): BoxResolvedStyle {
  const style: BoxResolvedStyle = {};

  applySpacing(style, props);

  if (props.display !== undefined) {
    style.display = props.display;
  }

  if (props.flexDirection !== undefined) {
    style.flexDirection = props.flexDirection;
  }

  if (props.justifyContent !== undefined) {
    style.justifyContent = props.justifyContent;
  }

  if (props.alignItems !== undefined) {
    style.alignItems = props.alignItems;
  }

  if (props.flexWrap !== undefined) {
    style.flexWrap = props.flexWrap;
  }

  const resolvedBackground = resolveColorValue(props.backgroundColor);
  if (resolvedBackground !== undefined) {
    style.backgroundColor = resolvedBackground;
  }

  const resolvedColor = resolveColorValue(props.color);
  if (resolvedColor !== undefined) {
    style.color = resolvedColor;
  }

  const resolvedBorderColor = resolveColorValue(props.borderColor);
  if (resolvedBorderColor !== undefined) {
    style.borderColor = resolvedBorderColor;
  }

  const resolvedBorderRadius = resolveRadiusValue(props.borderRadius);
  if (resolvedBorderRadius !== undefined) {
    style.borderRadius = resolvedBorderRadius;
  }

  const resolvedBorderWidth = resolveBorderWidthValue(props.borderWidth);
  if (resolvedBorderWidth !== undefined) {
    style.borderWidth = resolvedBorderWidth;
  }

  const resolvedBoxShadow = resolveBoxShadowValue(props.boxShadow);
  if (resolvedBoxShadow !== undefined) {
    style.boxShadow = resolvedBoxShadow;
  }

  const resolvedWidth = resolveDimensionValue(props.width);
  if (resolvedWidth !== undefined) {
    style.width = resolvedWidth;
  }

  const resolvedHeight = resolveDimensionValue(props.height);
  if (resolvedHeight !== undefined) {
    style.height = resolvedHeight;
  }

  return style;
}
