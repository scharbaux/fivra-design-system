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

function colorSuffix(color: ButtonColor): 'success' | 'warning' | 'error' {
  switch (color) {
    case 'primary-success':
      return 'success';
    case 'primary-warning':
      return 'warning';
    case 'primary-error':
      return 'error';
  }
}

export function createButtonColorOverrides(
  variant: ButtonVariant,
  color: ButtonColor,
): ButtonSemanticStyleOverrides {
  const suffix = colorSuffix(color);

  if (variant === 'primary') {
    return {
      '--fivra-button-surface': `var(--background-primary-${suffix})`,
      '--fivra-button-accent': `var(--background-primary-${suffix})`,
      '--fivra-button-border': `var(--border-primary-${suffix})`,
      '--fivra-button-text': 'var(--background-neutral-0)',
      '--fivra-button-hover-fallback': `var(--background-primary-${suffix})`,
      '--fivra-button-active-fallback': `var(--background-primary-${suffix})`,
    };
  }

  if (variant === 'secondary') {
    return {
      '--fivra-button-accent': `var(--text-primary-${suffix})`,
      '--fivra-button-border': `var(--border-primary-${suffix})`,
      '--fivra-button-text': `var(--text-primary-${suffix})`,
      '--fivra-button-hover-fallback': `var(--background-secondary-${suffix})`,
      '--fivra-button-active-fallback': `var(--background-secondary-${suffix})`,
    };
  }

  return {
    '--fivra-button-accent': `var(--text-primary-${suffix})`,
    '--fivra-button-text': `var(--text-primary-${suffix})`,
    '--fivra-button-hover-fallback': `var(--background-secondary-${suffix})`,
    '--fivra-button-active-fallback': `var(--background-secondary-${suffix})`,
  };
}
