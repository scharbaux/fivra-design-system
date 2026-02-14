export interface TokenA11yRule {
  id: string;
  label: string;
  textTokenPath: string;
  backgroundTokenPath: string;
  minRatio: number;
}

export const TOKEN_A11Y_RULES: TokenA11yRule[] = [
  {
    id: 'text-primary-on-neutral0',
    label: 'Primary interactive on neutral 0',
    textTokenPath: 'Text.Primary.Interactive',
    backgroundTokenPath: 'Background.Neutral.0',
    minRatio: 4.5,
  },
  {
    id: 'text-secondary-on-neutral0',
    label: 'Secondary interactive on neutral 0',
    textTokenPath: 'Text.Secondary.Interactive',
    backgroundTokenPath: 'Background.Neutral.0',
    minRatio: 4.5,
  },
  {
    id: 'text-success-on-bg-success',
    label: 'Success text on success background',
    textTokenPath: 'Text.Secondary.Success',
    backgroundTokenPath: 'Background.Secondary.Success',
    minRatio: 4.5,
  },
  {
    id: 'text-warning-on-bg-warning',
    label: 'Warning text on warning background',
    textTokenPath: 'Text.Secondary.Warning',
    backgroundTokenPath: 'Background.Secondary.Warning',
    minRatio: 4.5,
  },
  {
    id: 'text-error-on-bg-error',
    label: 'Error text on error background',
    textTokenPath: 'Text.Secondary.Error',
    backgroundTokenPath: 'Background.Secondary.Error',
    minRatio: 4.5,
  },
];
