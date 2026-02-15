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
    fontFamily: '--typography-heading-1-font-family',
    fontWeight: '--typography-heading-1-font-weight',
    fontSize: '--typography-heading-1-font-size',
    lineHeight: '--typography-heading-1-line-height',
  },
  {
    variant: 'heading-2',
    fontFamily: '--typography-heading-2-font-family',
    fontWeight: '--typography-heading-2-font-weight',
    fontSize: '--typography-heading-2-font-size',
    lineHeight: '--typography-heading-2-line-height',
  },
  {
    variant: 'heading-3',
    fontFamily: '--typography-heading-3-font-family',
    fontWeight: '--typography-heading-3-font-weight',
    fontSize: '--typography-heading-3-font-size',
    lineHeight: '--typography-heading-3-line-height',
  },
  {
    variant: 'body-1',
    fontFamily: '--typography-body-1-font-family',
    fontWeight: '--typography-body-1-font-weight',
    fontSize: '--typography-body-1-font-size',
    lineHeight: '--typography-body-1-line-height',
  },
  {
    variant: 'body-1-medium',
    fontFamily: '--typography-body-1-medium-font-family',
    fontWeight: '--typography-body-1-medium-font-weight',
    fontSize: '--typography-body-1-medium-font-size',
    lineHeight: '--typography-body-1-medium-line-height',
  },
  {
    variant: 'body-1-strong',
    fontFamily: '--typography-body-1-strong-font-family',
    fontWeight: '--typography-body-1-strong-font-weight',
    fontSize: '--typography-body-1-strong-font-size',
    lineHeight: '--typography-body-1-strong-line-height',
  },
  {
    variant: 'body-2',
    fontFamily: '--typography-body-2-font-family',
    fontWeight: '--typography-body-2-font-weight',
    fontSize: '--typography-body-2-font-size',
    lineHeight: '--typography-body-2-line-height',
    letterSpacing: '--typography-body-2-letter-spacing',
  },
  {
    variant: 'body-2-strong',
    fontFamily: '--typography-body-2-strong-font-family',
    fontWeight: '--typography-body-2-strong-font-weight',
    fontSize: '--typography-body-2-strong-font-size',
    lineHeight: '--typography-body-2-strong-line-height',
    letterSpacing: '--typography-body-2-strong-letter-spacing',
  },
  {
    variant: 'body-2-link',
    fontFamily: '--typography-body-2-link-font-family',
    fontWeight: '--typography-body-2-link-font-weight',
    fontSize: '--typography-body-2-link-font-size',
    lineHeight: '--typography-body-2-link-line-height',
    letterSpacing: '--typography-body-2-link-letter-spacing',
  },
  {
    variant: 'body-2-long',
    fontFamily: '--typography-body-2-long-font-family',
    fontWeight: '--typography-body-2-long-font-weight',
    fontSize: '--typography-body-2-long-font-size',
    lineHeight: '--typography-body-2-long-line-height',
    letterSpacing: '--typography-body-2-long-letter-spacing',
  },
  {
    variant: 'body-3',
    fontFamily: '--typography-body-3-font-family',
    fontWeight: '--typography-body-3-font-weight',
    fontSize: '--typography-body-3-font-size',
    lineHeight: '--typography-body-3-line-height',
    letterSpacing: '--typography-body-3-letter-spacing',
  },
  {
    variant: 'caption-1',
    fontFamily: '--typography-caption-1-font-family',
    fontWeight: '--typography-caption-1-font-weight',
    fontSize: '--typography-caption-1-font-size',
    lineHeight: '--typography-caption-1-line-height',
    letterSpacing: '--typography-caption-1-letter-spacing',
  },
  {
    variant: 'caption-1-strong',
    fontFamily: '--typography-caption-1-strong-font-family',
    fontWeight: '--typography-caption-1-strong-font-weight',
    fontSize: '--typography-caption-1-strong-font-size',
    lineHeight: '--typography-caption-1-strong-line-height',
    letterSpacing: '--typography-caption-1-strong-letter-spacing',
  },
];

const typographyVariantStyles = VARIANT_TOKEN_CONFIGS.map((config) => {
  const letterSpacingDeclaration = config.letterSpacing
    ? `  letter-spacing: var(${config.letterSpacing});\n`
    : '';

  return `.${TYPOGRAPHY_CLASS_NAME}[data-variant="${config.variant}"] {\n  font-family: var(${config.fontFamily});\n  font-weight: var(${config.fontWeight});\n  font-size: var(${config.fontSize});\n  line-height: var(${config.lineHeight});\n${letterSpacingDeclaration}}`;
}).join('\n\n');

const TYPOGRAPHY_BASE_STYLES = `.${TYPOGRAPHY_CLASS_NAME} {\n  margin: 0;\n  color: var(--text-neutral-1);\n}\n\n.${TYPOGRAPHY_CLASS_NAME}[data-truncate="true"] {\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.${TYPOGRAPHY_CLASS_NAME}[data-nowrap="true"] {\n  white-space: nowrap;\n}\n\n.${TYPOGRAPHY_CLASS_NAME}[data-variant="body-2-link"] {\n  color: var(--text-primary-interactive, var(--text-neutral-1));\n  text-decoration: underline;\n}\n`;

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
