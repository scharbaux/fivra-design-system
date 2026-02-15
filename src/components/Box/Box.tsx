import React, { forwardRef, useEffect } from 'react';

import {
  BOX_CLASS_NAME,
  type BoxBorderWidthToken,
  type BoxRadiusToken,
  type BoxSpacingToken,
  ensureBoxStyles,
} from './box.styles';
import { createBoxStyles, type BoxSpacingValue, type BoxStyleInput } from './box.helpers';

type BoxOwnProps<T extends React.ElementType> = BoxStyleInput & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type BoxProps<T extends React.ElementType> = BoxOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BoxOwnProps<T>>;

type BoxComponent = <T extends React.ElementType = 'div'>(
  props: BoxProps<T> & { ref?: PolymorphicRef<T> },
) => React.ReactElement | null;

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

  const computedStyle = createBoxStyles({
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
  }) as React.CSSProperties;

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
export type { BoxBorderWidthToken, BoxRadiusToken, BoxSpacingToken, BoxSpacingValue };
