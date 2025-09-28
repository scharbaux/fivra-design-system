import React, { forwardRef, useEffect } from 'react';

import {
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from './button.styles';

function cx(...values: Array<string | undefined | false | null>): string {
  return values.filter(Boolean).join(' ');
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Compact (`sm`), default (`md`), or spacious (`lg`) sizing scale. Defaults to `md`. */
  size?: ButtonSize;
  /** When `true`, the button stretches to fill the width of its container. */
  fullWidth?: boolean;
  /** Optional leading icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Optional trailing icon rendered after the label. */
  trailingIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    className,
    children,
    type,
    ...rest
  } = props;

  useEffect(() => {
    ensureButtonStyles();
  }, []);

  const buttonType = type ?? 'button';

  return (
    <button
      {...rest}
      ref={ref}
      type={buttonType}
      className={cx(BUTTON_CLASS_NAME, className ?? undefined)}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? 'true' : undefined}
    >
      {leadingIcon ? (
        <span className={cx(BUTTON_ICON_CLASS, BUTTON_LEADING_ICON_CLASS)} aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className={BUTTON_LABEL_CLASS}>{children}</span>
      {trailingIcon ? (
        <span className={cx(BUTTON_ICON_CLASS, BUTTON_TRAILING_ICON_CLASS)} aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export type { ButtonVariant, ButtonSize };
