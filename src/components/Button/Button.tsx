import React, { forwardRef, useEffect } from 'react';

import {
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  BUTTON_CARET_CLASS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from './button.styles';
import type { ButtonColor } from './color-overrides';
import { createButtonColorOverrides } from './color-overrides';
import { Icon } from '@components/Icon';

function cx(...values: Array<string | undefined | false | null>): string {
  return values.filter(Boolean).join(' ');
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Preset palette identifier. Initially supports success/warning/error variants. */
  color?: ButtonColor;
  /** Compact (`sm`), default (`md`), or spacious (`lg`) sizing scale. Defaults to `md`. */
  size?: ButtonSize;
  /** When `true`, the button stretches to fill the width of its container. */
  fullWidth?: boolean;
  /** Visible label text. Prefer this over children for simple usage. */
  label?: React.ReactNode;
  /** Optional leading icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Convenience prop: renders the shared Icon component before the label. */
  leadingIconName?: string;
  /** Optional trailing icon rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Convenience prop: renders the shared Icon component after the label. */
  trailingIconName?: string;
  /** Overrides the surface color via a design token string (e.g., `background-primary-success`). */
  surfaceColor?: string;
  /** Overrides the border color via a design token string (e.g., `border-primary-success`). */
  borderColor?: string;
  /** Overrides the text color via a design token string (e.g., `text-on-primary`). */
  textColor?: string;
  /** Overrides the accent color used for state layers via a design token string. */
  accentColor?: string;
  /** Hides the visible label for icon-only buttons. Provide an `aria-label`. */
  iconOnly?: boolean;
  /** Overrides automatic label detection when rendering a visually hidden label. */
  hasLabel?: boolean;
  /** Adds a disclosure caret to the button. */
  dropdown?: boolean;
  /** Displays a spinner and marks the button as busy. */
  loading?: boolean;
}

function hasLabelContent(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0;
    }

    if (typeof child === 'number') {
      return true;
    }

    if (React.isValidElement(child)) {
      if (child.type === React.Fragment) {
        return hasLabelContent(child.props.children);
      }

      if ('children' in child.props) {
        return hasLabelContent(child.props.children);
      }

      return true;
    }

    return false;
  });
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    color,
    size = DEFAULT_BUTTON_SIZE,
    fullWidth = false,
    label,
    leadingIcon,
    leadingIconName,
    trailingIcon,
    trailingIconName,
    surfaceColor,
    borderColor,
    textColor,
    accentColor,
    iconOnly = false,
    hasLabel,
    dropdown = false,
    loading = false,
    className,
    style: styleProp,
    children,
    type,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-haspopup': ariaHasPopup,
    'aria-expanded': ariaExpanded,
    ...rest
  } = props;

  useEffect(() => {
    ensureButtonStyles();
  }, []);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      iconOnly &&
      !ariaLabel &&
      !ariaLabelledBy
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        'Button: iconOnly buttons must include an accessible name via `aria-label` or `aria-labelledby`.',
      );
    }
  }, [ariaLabel, ariaLabelledBy, iconOnly]);

  const content = children ?? label;
  const resolvedHasLabel =
    typeof hasLabel === 'boolean'
      ? hasLabel
      : iconOnly
        ? false
        : hasLabelContent(content);
  const buttonType = type ?? 'button';
  const resolvedAriaHasPopup = ariaHasPopup ?? (dropdown ? 'menu' : undefined);

  const semanticOverrides =
    color ? (createButtonColorOverrides(variant, color) as unknown as React.CSSProperties) : undefined;

  const directOverrides: React.CSSProperties | undefined =
    surfaceColor || borderColor || textColor || accentColor
      ? ({
          ...(surfaceColor
            ? { ['--fivra-button-surface' as any]: resolveColorValue(surfaceColor) }
            : {}),
          ...(borderColor
            ? { ['--fivra-button-border' as any]: resolveColorValue(borderColor) }
            : {}),
          ...(textColor
            ? { ['--fivra-button-text' as any]: resolveColorValue(textColor) }
            : {}),
          ...(accentColor
            ? { ['--fivra-button-accent' as any]: resolveColorValue(accentColor) }
            : {}),
        } satisfies React.CSSProperties)
      : undefined;

  const mergedStyle =
    semanticOverrides || directOverrides || styleProp
      ? ({
          ...(semanticOverrides ?? {}),
          ...(directOverrides ?? {}),
          ...(styleProp as React.CSSProperties | undefined),
        } satisfies React.CSSProperties)
      : undefined;

  const resolvedLeadingIcon =
    leadingIcon ?? (leadingIconName ? (
      <Icon name={leadingIconName} variant="solid" color="currentColor" aria-hidden="true" />
    ) : null);
  const resolvedTrailingIcon =
    trailingIcon ?? (trailingIconName ? (
      <Icon name={trailingIconName} variant="solid" color="currentColor" aria-hidden="true" />
    ) : null);

  return (
    <button
      {...rest}
      ref={ref}
      type={buttonType}
      style={mergedStyle}
      className={cx(
        BUTTON_CLASS_NAME,
        className ?? undefined,
      )}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? 'true' : undefined}
      data-icon-only={iconOnly ? 'true' : undefined}
      data-has-label={resolvedHasLabel ? 'true' : 'false'}
      data-dropdown={dropdown ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-haspopup={resolvedAriaHasPopup}
      aria-expanded={ariaExpanded}
      aria-busy={loading || undefined}
    >
      {loading ? <span className={BUTTON_SPINNER_CLASS} aria-hidden="true" /> : null}
      {resolvedLeadingIcon ? (
        <span className={cx(BUTTON_ICON_CLASS, BUTTON_LEADING_ICON_CLASS)} aria-hidden="true">
          {resolvedLeadingIcon}
        </span>
      ) : null}
      {resolvedHasLabel ? <span className={BUTTON_LABEL_CLASS}>{content}</span> : null}
      {resolvedTrailingIcon ? (
        <span className={cx(BUTTON_ICON_CLASS, BUTTON_TRAILING_ICON_CLASS)} aria-hidden="true">
          {resolvedTrailingIcon}
        </span>
      ) : null}
      {dropdown ? <span className={BUTTON_CARET_CLASS} aria-hidden="true" /> : null}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export type { ButtonVariant, ButtonSize };
