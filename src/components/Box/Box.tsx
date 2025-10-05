import React, { forwardRef, useEffect } from 'react';

import {
  BOX_BORDER_WIDTH_TOKENS,
  BOX_CLASS_NAME,
  BOX_RADIUS_TOKENS,
  BOX_SPACING_TOKENS,
  type BoxBorderWidthToken,
  type BoxRadiusToken,
  type BoxSpacingToken,
  ensureBoxStyles,
} from './box.styles';

type BoxSpacingValue = BoxSpacingToken | number | string;

type BoxOwnProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
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
  display?: React.CSSProperties['display'];
  flexDirection?: React.CSSProperties['flexDirection'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  flexWrap?: React.CSSProperties['flexWrap'];
  // Visual props
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: BoxRadiusToken | number | string;
  borderWidth?: BoxBorderWidthToken | number | string;
  boxShadow?: React.CSSProperties['boxShadow'];
  width?: BoxSpacingValue;
  height?: BoxSpacingValue;
};

type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

type BoxProps<T extends React.ElementType> = BoxOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BoxOwnProps<T>>;

type BoxComponent = <T extends React.ElementType = 'div'>(
  props: BoxProps<T> & { ref?: PolymorphicRef<T> },
) => React.ReactElement | null;

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

function capitalizeTokenSegment(segment: string): string {
  if (!segment) {
    return segment;
  }

  return segment[0].toUpperCase() + segment.slice(1);
}

function toCssVariableName(token: string): string {
  const [first, ...rest] = token.split('-');
  const suffix = rest.map(capitalizeTokenSegment).join('');
  return `--${first}${suffix}`;
}

function resolveSpacingValue(value: BoxSpacingValue | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    if (isSpacingToken(value)) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    if (isDesignToken(value) && value.startsWith('spacing-')) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    return value;
  }

  return value;
}

function isDesignToken(value: string): boolean {
  return /^[a-z]+(?:-[a-z0-9]+)+$/i.test(value);
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

function resolveRadiusValue(value: BoxOwnProps<React.ElementType>['borderRadius']): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    if (isRadiusToken(value)) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    if (isDesignToken(value) && value.startsWith('radius-')) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    return value;
  }

  return value;
}

function resolveBorderWidthValue(
  value: BoxOwnProps<React.ElementType>['borderWidth'],
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string') {
    if (isBorderWidthToken(value)) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
    }

    if (isDesignToken(value) && value.startsWith('border-width-')) {
      return `calc(var(${toCssVariableName(value)}) * 1px)`;
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

function resolveBoxShadowValue(value: React.CSSProperties['boxShadow']): React.CSSProperties['boxShadow'] {
  if (!value || typeof value !== 'string') {
    return value;
  }

  if (value.startsWith('var(')) {
    return value;
  }

  if (isDesignToken(value) && value.startsWith('shadow-')) {
    return `var(${toCssVariableName(value)})`;
  }

  return value;
}

type MutableStyle = React.CSSProperties & Record<string, unknown>;

type SpacingProps = Pick<
  BoxOwnProps<React.ElementType>,
  | 'm'
  | 'mx'
  | 'my'
  | 'mt'
  | 'mr'
  | 'mb'
  | 'ml'
  | 'p'
  | 'px'
  | 'py'
  | 'pt'
  | 'pr'
  | 'pb'
  | 'pl'
  | 'gap'
  | 'rowGap'
  | 'columnGap'
>;

function applySpacing(style: MutableStyle, props: SpacingProps): void {
  const marginOrder: Array<keyof SpacingProps> = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'];
  const paddingOrder: Array<keyof SpacingProps> = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'];

  for (const key of marginOrder) {
    const value = props[key];
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
    const value = props[key];
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

function BoxInner<T extends React.ElementType = 'div'>(
  props: BoxProps<T>,
  ref: PolymorphicRef<T>,
) {
  const {
    as,
    className,
    children,
    style,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    gap,
    rowGap,
    columnGap,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    backgroundColor,
    color,
    borderColor,
    borderRadius,
    borderWidth,
    boxShadow,
    width,
    height,
    ...rest
  } = props;

  useEffect(() => {
    ensureBoxStyles();
  }, []);

  const Component = (as ?? 'div') as React.ElementType;

  const computedStyle: MutableStyle = {};
  applySpacing(computedStyle, {
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    gap,
    rowGap,
    columnGap,
  });

  if (display !== undefined) {
    computedStyle.display = display;
  }

  if (flexDirection !== undefined) {
    computedStyle.flexDirection = flexDirection;
  }

  if (justifyContent !== undefined) {
    computedStyle.justifyContent = justifyContent;
  }

  if (alignItems !== undefined) {
    computedStyle.alignItems = alignItems;
  }

  if (flexWrap !== undefined) {
    computedStyle.flexWrap = flexWrap;
  }

  const resolvedBackground = resolveColorValue(backgroundColor);
  if (resolvedBackground !== undefined) {
    computedStyle.backgroundColor = resolvedBackground;
  }

  const resolvedColor = resolveColorValue(color);
  if (resolvedColor !== undefined) {
    computedStyle.color = resolvedColor;
  }

  const resolvedBorderColor = resolveColorValue(borderColor);
  if (resolvedBorderColor !== undefined) {
    computedStyle.borderColor = resolvedBorderColor;
  }

  const resolvedBorderRadius = resolveRadiusValue(borderRadius);
  if (resolvedBorderRadius !== undefined) {
    computedStyle.borderRadius = resolvedBorderRadius;
  }

  const resolvedBorderWidth = resolveBorderWidthValue(borderWidth);
  if (resolvedBorderWidth !== undefined) {
    computedStyle.borderWidth = resolvedBorderWidth;
  }

  const resolvedBoxShadow = resolveBoxShadowValue(boxShadow);
  if (resolvedBoxShadow !== undefined) {
    computedStyle.boxShadow = resolvedBoxShadow;
  }

  const resolvedWidth = resolveDimensionValue(width);
  if (resolvedWidth !== undefined) {
    computedStyle.width = resolvedWidth;
  }

  const resolvedHeight = resolveDimensionValue(height);
  if (resolvedHeight !== undefined) {
    computedStyle.height = resolvedHeight;
  }

  const mergedStyle = style ? { ...computedStyle, ...style } : computedStyle;

  return (
    <Component
      {...(rest as React.ComponentPropsWithoutRef<T>)}
      ref={ref}
      className={[BOX_CLASS_NAME, className].filter(Boolean).join(' ')}
      style={mergedStyle}
    >
      {children}
    </Component>
  );
}

const Box = forwardRef(BoxInner as unknown as React.ForwardRefRenderFunction<
  HTMLElement,
  BoxProps<React.ElementType>
>) as unknown as BoxComponent & { displayName?: string };

Box.displayName = 'Box';

export { Box };
export type { BoxBorderWidthToken, BoxProps, BoxRadiusToken, BoxSpacingToken };
