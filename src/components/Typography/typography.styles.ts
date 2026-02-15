const TYPOGRAPHY_STYLE_ATTRIBUTE = 'data-fivra-typography-styles';

export const TYPOGRAPHY_CLASS_NAME = 'fivra-typography';

export const DEFAULT_TYPOGRAPHY_VARIANT = 'body-1';

export type TypographyVariant =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'body-1'
  | 'body-1-medium'
  | 'body-1-strong'
  | 'body-2'
  | 'body-2-strong'
  | 'body-2-link'
  | 'body-2-long'
  | 'body-3'
  | 'caption-1'
  | 'caption-1-strong';

type VariantTokenConfig = {
  variant: TypographyVariant;
  fontFamily: TokenVariable;
  fontWeight: TokenVariable;
  fontSize: TokenVariable;
  lineHeight: TokenVariable;
  letterSpacing?: TokenVariable;
};

type TokenVariable = {
  canonical: string;
  legacy?: string;
};

function token(canonical: string, legacy?: string): TokenVariable {
  return { canonical, legacy };
}

function resolveTokenValue(variable: TokenVariable): string {
  if (variable.legacy) {
    return `var(${variable.canonical}, var(${variable.legacy}))`;
  }

  return `var(${variable.canonical})`;
}

const VARIANT_TOKEN_CONFIGS: VariantTokenConfig[] = [
  {
    variant: 'heading-1',
    fontFamily: token('--typographyHeading1FontFamily', '--heading1FontFamily'),
    fontWeight: token('--typographyHeading1FontWeight', '--heading1FontWeight'),
    fontSize: token('--typographyHeading1FontSize', '--heading1FontSize'),
    lineHeight: token('--typographyHeading1LineHeight', '--heading1LineHeight'),
  },
  {
    variant: 'heading-2',
    fontFamily: token('--typographyHeading2FontFamily', '--heading2FontFamily'),
    fontWeight: token('--typographyHeading2FontWeight', '--heading2FontWeight'),
    fontSize: token('--typographyHeading2FontSize', '--heading2FontSize'),
    lineHeight: token('--typographyHeading2LineHeight', '--heading2LineHeight'),
  },
  {
    variant: 'heading-3',
    fontFamily: token('--typographyHeading3FontFamily', '--heading3FontFamily'),
    fontWeight: token('--typographyHeading3FontWeight', '--heading3FontWeight'),
    fontSize: token('--typographyHeading3FontSize', '--heading3FontSize'),
    lineHeight: token('--typographyHeading3LineHeight', '--heading3LineHeight'),
  },
  {
    variant: 'body-1',
    fontFamily: token('--typographyBody1FontFamily', '--body1FontFamily'),
    fontWeight: token('--typographyBody1FontWeight', '--body1FontWeight'),
    fontSize: token('--typographyBody1FontSize', '--body1FontSize'),
    lineHeight: token('--typographyBody1LineHeight', '--body1LineHeight'),
  },
  {
    variant: 'body-1-medium',
    fontFamily: token('--typographyBody1MediumFontFamily', '--body1MediumFontFamily'),
    fontWeight: token('--typographyBody1MediumFontWeight', '--body1MediumFontWeight'),
    fontSize: token('--typographyBody1MediumFontSize', '--body1MediumFontSize'),
    lineHeight: token('--typographyBody1MediumLineHeight', '--body1MediumLineHeight'),
  },
  {
    variant: 'body-1-strong',
    fontFamily: token('--typographyBody1StrongFontFamily', '--body1StrongFontFamily'),
    fontWeight: token('--typographyBody1StrongFontWeight', '--body1StrongFontWeight'),
    fontSize: token('--typographyBody1StrongFontSize', '--body1StrongFontSize'),
    lineHeight: token('--typographyBody1StrongLineHeight', '--body1StrongLineHeight'),
  },
  {
    variant: 'body-2',
    fontFamily: token('--typographyBody2FontFamily', '--body2FontFamily'),
    fontWeight: token('--typographyBody2FontWeight', '--body2FontWeight'),
    fontSize: token('--typographyBody2FontSize', '--body2FontSize'),
    lineHeight: token('--typographyBody2LineHeight', '--body2LineHeight'),
    letterSpacing: token('--typographyBody2LetterSpacing', '--body2LetterSpacing'),
  },
  {
    variant: 'body-2-strong',
    fontFamily: token('--typographyBody2StrongFontFamily', '--body2StrongFontFamily'),
    fontWeight: token('--typographyBody2StrongFontWeight', '--body2StrongFontWeight'),
    fontSize: token('--typographyBody2StrongFontSize', '--body2StrongFontSize'),
    lineHeight: token('--typographyBody2StrongLineHeight', '--body2StrongLineHeight'),
    letterSpacing: token('--typographyBody2StrongLetterSpacing', '--body2StrongLetterSpacing'),
  },
  {
    variant: 'body-2-link',
    fontFamily: token('--typographyBody2LinkFontFamily', '--body2LinkFontFamily'),
    fontWeight: token('--typographyBody2LinkFontWeight', '--body2LinkFontWeight'),
    fontSize: token('--typographyBody2LinkFontSize', '--body2LinkFontSize'),
    lineHeight: token('--typographyBody2LinkLineHeight', '--body2LinkLineHeight'),
    letterSpacing: token('--typographyBody2LinkLetterSpacing', '--body2LinkLetterSpacing'),
  },
  {
    variant: 'body-2-long',
    fontFamily: token('--typographyBody2LongFontFamily', '--body2LongFontFamily'),
    fontWeight: token('--typographyBody2LongFontWeight', '--body2LongFontWeight'),
    fontSize: token('--typographyBody2LongFontSize', '--body2LongFontSize'),
    lineHeight: token('--typographyBody2LongLineHeight', '--body2LongLineHeight'),
    letterSpacing: token('--typographyBody2LongLetterSpacing', '--body2LongLetterSpacing'),
  },
  {
    variant: 'body-3',
    fontFamily: token('--typographyBody3FontFamily', '--body3FontFamily'),
    fontWeight: token('--typographyBody3FontWeight', '--body3FontWeight'),
    fontSize: token('--typographyBody3FontSize', '--body3FontSize'),
    lineHeight: token('--typographyBody3LineHeight', '--body3LineHeight'),
    letterSpacing: token('--typographyBody3LetterSpacing', '--body3LetterSpacing'),
  },
  {
    variant: 'caption-1',
    fontFamily: token('--typographyCaption1FontFamily', '--caption1FontFamily'),
    fontWeight: token('--typographyCaption1FontWeight', '--caption1FontWeight'),
    fontSize: token('--typographyCaption1FontSize', '--caption1FontSize'),
    lineHeight: token('--typographyCaption1LineHeight', '--caption1LineHeight'),
    letterSpacing: token('--typographyCaption1LetterSpacing', '--caption1LetterSpacing'),
  },
  {
    variant: 'caption-1-strong',
    fontFamily: token('--typographyCaption1StrongFontFamily', '--caption1StrongFontFamily'),
    fontWeight: token('--typographyCaption1StrongFontWeight', '--caption1StrongFontWeight'),
    fontSize: token('--typographyCaption1StrongFontSize', '--caption1StrongFontSize'),
    lineHeight: token('--typographyCaption1StrongLineHeight', '--caption1StrongLineHeight'),
    letterSpacing: token('--typographyCaption1StrongLetterSpacing', '--caption1StrongLetterSpacing'),
  },
];

const typographyVariantStyles = VARIANT_TOKEN_CONFIGS.map((config) => {
  const letterSpacingDeclaration = config.letterSpacing
    ? `  letter-spacing: ${resolveTokenValue(config.letterSpacing)};\n`
    : '';

  return `.${TYPOGRAPHY_CLASS_NAME}[data-variant="${config.variant}"] {\n  font-family: ${resolveTokenValue(config.fontFamily)};\n  font-weight: ${resolveTokenValue(config.fontWeight)};\n  font-size: ${resolveTokenValue(config.fontSize)};\n  line-height: ${resolveTokenValue(config.lineHeight)};\n${letterSpacingDeclaration}}`;
}).join('\n\n');

const TYPOGRAPHY_BASE_STYLES = `.${TYPOGRAPHY_CLASS_NAME} {\n  margin: 0;\n  color: var(--textNeutral1);\n}\n\n.${TYPOGRAPHY_CLASS_NAME}[data-truncate="true"] {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.${TYPOGRAPHY_CLASS_NAME}[data-nowrap="true"] {\n  white-space: nowrap;\n}\n\n.${TYPOGRAPHY_CLASS_NAME}[data-variant="body-2-link"] {\n  color: var(--textPrimaryInteractive, var(--textNeutral1));\n  text-decoration: underline;\n}\n`;

const TYPOGRAPHY_STYLES = `${TYPOGRAPHY_BASE_STYLES}\n${typographyVariantStyles}`;

export const TYPOGRAPHY_VARIANTS = VARIANT_TOKEN_CONFIGS.map((config) => config.variant) as readonly TypographyVariant[];

let hasInjectedTypographyStyles = false;

export function ensureTypographyStyles(): void {
  if (hasInjectedTypographyStyles || typeof document === 'undefined') {
    return;
  }

  const existing = document.querySelector(`style[${TYPOGRAPHY_STYLE_ATTRIBUTE}="true"]`);
  if (existing) {
    hasInjectedTypographyStyles = true;
    return;
  }

  const style = document.createElement('style');
  style.setAttribute(TYPOGRAPHY_STYLE_ATTRIBUTE, 'true');
  style.textContent = TYPOGRAPHY_STYLES;
  document.head.appendChild(style);
  hasInjectedTypographyStyles = true;
}

export { TYPOGRAPHY_STYLES };
