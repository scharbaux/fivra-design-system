import React, { forwardRef, useEffect } from 'react';

import {
  DEFAULT_TYPOGRAPHY_VARIANT,
  TYPOGRAPHY_CLASS_NAME,
  TYPOGRAPHY_VARIANTS,
  type TypographyVariant,
  ensureTypographyStyles,
} from './typography.styles';

type TypographyOwnProps = {
  /** Visual variant mapped to design tokens. Defaults to `body-1`. */
  variant?: TypographyVariant;
  /** Truncates overflowing text with an ellipsis. */
  truncate?: boolean;
  /** Prevents line wrapping without truncation styling. */
  noWrap?: boolean;
  /** Override the rendered element. Defaults based on `variant`. */
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
};

type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

type TypographyProps<T extends React.ElementType> = TypographyOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof TypographyOwnProps>;

type TypographyComponent = <T extends React.ElementType = 'p'>(
  props: TypographyProps<T> & { ref?: PolymorphicRef<T> },
) => React.ReactElement | null;

const VARIANT_DEFAULT_ELEMENTS: Record<TypographyVariant, React.ElementType> = {
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'body-1': 'p',
  'body-1-medium': 'p',
  'body-1-strong': 'p',
  'body-2': 'p',
  'body-2-strong': 'p',
  'body-2-link': 'p',
  'body-2-long': 'p',
  'body-3': 'p',
  'caption-1': 'span',
  'caption-1-strong': 'span',
};

function resolveDefaultElement(variant: TypographyVariant): React.ElementType {
  return VARIANT_DEFAULT_ELEMENTS[variant] ?? 'p';
}

function TypographyInner<T extends React.ElementType = 'p'>(
  props: TypographyProps<T>,
  ref: PolymorphicRef<T>,
) {
  const {
    variant = DEFAULT_TYPOGRAPHY_VARIANT,
    truncate = false,
    noWrap = false,
    as,
    className,
    children,
    ...rest
  } = props;

  useEffect(() => {
    ensureTypographyStyles();
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    if (!TYPOGRAPHY_VARIANTS.includes(variant)) {
      // eslint-disable-next-line no-console
      console.warn(
        `Typography: unsupported variant "${variant}". Falling back to token-driven defaults may not behave as expected.`,
      );
    }
  }

  const Component = (as ?? resolveDefaultElement(variant)) as React.ElementType;
  const dataVariant = TYPOGRAPHY_VARIANTS.includes(variant)
    ? variant
    : DEFAULT_TYPOGRAPHY_VARIANT;

  return (
    <Component
      {...(rest as React.ComponentPropsWithoutRef<T>)}
      ref={ref}
      className={[TYPOGRAPHY_CLASS_NAME, className].filter(Boolean).join(' ')}
      data-variant={dataVariant}
      data-truncate={truncate ? 'true' : undefined}
      data-nowrap={noWrap ? 'true' : undefined}
    >
      {children}
    </Component>
  );
}

const Typography = forwardRef(TypographyInner as unknown as React.ForwardRefRenderFunction<
  HTMLElement,
  TypographyProps<React.ElementType>
>) as unknown as TypographyComponent & { displayName?: string };

Typography.displayName = 'Typography';

export { Typography };
export type { TypographyVariant };
