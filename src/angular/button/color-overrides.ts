import type { ButtonVariant } from './button.styles';

// `color` is a preset identifier for commonly desired color configurations.
// Keep it as a closed union so docs and TS autocomplete stay clear.
export type ButtonColor =
  | 'primary-success'
  | 'primary-warning'
  | 'primary-error';

type CssVarName =
  | '--fivra-button-surface'
  | '--fivra-button-accent'
  | '--fivra-button-border'
  | '--fivra-button-text'
  | '--fivra-button-hover-fallback'
  | '--fivra-button-active-fallback';

export type ButtonSemanticStyleOverrides = Partial<Record<CssVarName, string>>;

function colorSuffix(color: ButtonColor): 'Success' | 'Warning' | 'Error' {
  switch (color) {
    case 'primary-success':
      return 'Success';
    case 'primary-warning':
      return 'Warning';
    case 'primary-error':
      return 'Error';
  }
}

export function createButtonColorOverrides(
  variant: ButtonVariant,
  color: ButtonColor,
): ButtonSemanticStyleOverrides {
  const suffix = colorSuffix(color);

  if (variant === 'primary') {
    return {
      '--fivra-button-surface': `var(--backgroundPrimary${suffix})`,
      '--fivra-button-accent': `var(--backgroundPrimary${suffix})`,
      '--fivra-button-border': `var(--borderPrimary${suffix})`,
      '--fivra-button-text': 'var(--backgroundNeutral0)',
      '--fivra-button-hover-fallback': `var(--backgroundPrimary${suffix})`,
      '--fivra-button-active-fallback': `var(--backgroundPrimary${suffix})`,
    };
  }

  if (variant === 'secondary') {
    return {
      '--fivra-button-accent': `var(--textPrimary${suffix})`,
      '--fivra-button-border': `var(--borderPrimary${suffix})`,
      '--fivra-button-text': `var(--textPrimary${suffix})`,
      '--fivra-button-hover-fallback': `var(--backgroundSecondary${suffix})`,
      '--fivra-button-active-fallback': `var(--backgroundSecondary${suffix})`,
    };
  }

  return {
    '--fivra-button-accent': `var(--textPrimary${suffix})`,
    '--fivra-button-text': `var(--textPrimary${suffix})`,
    '--fivra-button-hover-fallback': `var(--backgroundSecondary${suffix})`,
    '--fivra-button-active-fallback': `var(--backgroundSecondary${suffix})`,
  };
}

