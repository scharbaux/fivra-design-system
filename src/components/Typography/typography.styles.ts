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
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
};

const VARIANT_TOKEN_CONFIGS: VariantTokenConfig[] = [
  {
    variant: 'heading-1',
    fontFamily: '--heading1FontFamily',
    fontWeight: '--heading1FontWeight',
    fontSize: '--heading1FontSize',
    lineHeight: '--heading1LineHeight',
  },
  {
    variant: 'heading-2',
    fontFamily: '--heading2FontFamily',
    fontWeight: '--heading2FontWeight',
    fontSize: '--heading2FontSize',
    lineHeight: '--heading2LineHeight',
  },
  {
    variant: 'heading-3',
    fontFamily: '--heading3FontFamily',
    fontWeight: '--heading3FontWeight',
    fontSize: '--heading3FontSize',
    lineHeight: '--heading3LineHeight',
  },
  {
    variant: 'body-1',
    fontFamily: '--body1FontFamily',
    fontWeight: '--body1FontWeight',
    fontSize: '--body1FontSize',
    lineHeight: '--body1LineHeight',
  },
  {
    variant: 'body-1-medium',
    fontFamily: '--body1MediumFontFamily',
    fontWeight: '--body1MediumFontWeight',
    fontSize: '--body1MediumFontSize',
    lineHeight: '--body1MediumLineHeight',
  },
  {
    variant: 'body-1-strong',
    fontFamily: '--body1StrongFontFamily',
    fontWeight: '--body1StrongFontWeight',
    fontSize: '--body1StrongFontSize',
    lineHeight: '--body1StrongLineHeight',
  },
  {
    variant: 'body-2',
    fontFamily: '--body2FontFamily',
    fontWeight: '--body2FontWeight',
    fontSize: '--body2FontSize',
    lineHeight: '--body2LineHeight',
    letterSpacing: '--body2LetterSpacing',
  },
  {
    variant: 'body-2-strong',
    fontFamily: '--body2StrongFontFamily',
    fontWeight: '--body2StrongFontWeight',
    fontSize: '--body2StrongFontSize',
    lineHeight: '--body2StrongLineHeight',
    letterSpacing: '--body2StrongLetterSpacing',
  },
  {
    variant: 'body-2-link',
    fontFamily: '--body2LinkFontFamily',
    fontWeight: '--body2LinkFontWeight',
    fontSize: '--body2LinkFontSize',
    lineHeight: '--body2LinkLineHeight',
    letterSpacing: '--body2LinkLetterSpacing',
  },
  {
    variant: 'body-2-long',
    fontFamily: '--body2LongFontFamily',
    fontWeight: '--body2LongFontWeight',
    fontSize: '--body2LongFontSize',
    lineHeight: '--body2LongLineHeight',
    letterSpacing: '--body2LongLetterSpacing',
  },
  {
    variant: 'body-3',
    fontFamily: '--body3FontFamily',
    fontWeight: '--body3FontWeight',
    fontSize: '--body3FontSize',
    lineHeight: '--body3LineHeight',
    letterSpacing: '--body3LetterSpacing',
  },
  {
    variant: 'caption-1',
    fontFamily: '--caption1FontFamily',
    fontWeight: '--caption1FontWeight',
    fontSize: '--caption1FontSize',
    lineHeight: '--caption1LineHeight',
    letterSpacing: '--caption1LetterSpacing',
  },
  {
    variant: 'caption-1-strong',
    fontFamily: '--caption1StrongFontFamily',
    fontWeight: '--caption1StrongFontWeight',
    fontSize: '--caption1StrongFontSize',
    lineHeight: '--caption1StrongLineHeight',
    letterSpacing: '--caption1StrongLetterSpacing',
  },
];

const typographyVariantStyles = VARIANT_TOKEN_CONFIGS.map((config) => {
  const letterSpacingDeclaration = config.letterSpacing
    ? `  letter-spacing: var(${config.letterSpacing});\n`
    : '';

  return `.${TYPOGRAPHY_CLASS_NAME}[data-variant="${config.variant}"] {\n  font-family: var(${config.fontFamily});\n  font-weight: var(${config.fontWeight});\n  font-size: var(${config.fontSize});\n  line-height: var(${config.lineHeight});\n${letterSpacingDeclaration}}`;
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
