export type IconPathEntry =
  | string
  | { d: string; fillRule?: 'evenodd' | 'nonzero'; clipRule?: 'evenodd' | 'nonzero' };

export type IconPaths = { paths: IconPathEntry[]; viewBox?: string };
export type IconSvg = { svg: string; viewBox?: string };

export type PortableIconSource = string | IconPaths | IconSvg;

export type VariantProp = 'outline' | 'solid' | 'fill' | 'stroke';
export type NormalizedVariant = 'outline' | 'solid';

export type IconVariants<TSource = PortableIconSource> = {
  outline?: TSource;
  solid?: TSource;
};

export type IconsMap<TSource = PortableIconSource> = Record<string, TSource | IconVariants<TSource>>;

export const DEFAULT_VIEWBOX = '0 0 24 24';
const ICON_SIZE_TOKEN_PREFIX = '--iconsizes-';
const TEXT_TOKEN_PREFIX = '--text-';

export function isSvgMarkup(value: string): boolean {
  return typeof value === 'string' && /<\s*svg[\s>]/i.test(value);
}

function isCssVar(value: string): boolean {
  return /^var\(\s*--[^)]+\)$/u.test(value.trim());
}

function isCssLengthExpression(value: string): boolean {
  const trimmed = value.trim();
  return (
    /^-?\d*\.?\d+(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/u.test(trimmed) ||
    /^(calc|min|max|clamp)\(/u.test(trimmed)
  );
}

export function resolveIconSize(value?: number | string): number | string | undefined {
  if (value == null || typeof value === 'number') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (isCssVar(trimmed) || isCssLengthExpression(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('--')) {
    return `var(${trimmed})`;
  }

  if (trimmed.startsWith('iconsizes-')) {
    return `var(--${trimmed})`;
  }

  return `var(${ICON_SIZE_TOKEN_PREFIX}${trimmed})`;
}

export function resolveIconColor(value?: string): string | undefined {
  if (value == null) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (isCssVar(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('--')) {
    return `var(${trimmed})`;
  }

  if (trimmed.startsWith('text-')) {
    return `var(${TEXT_TOKEN_PREFIX}${trimmed.slice('text-'.length)})`;
  }

  return trimmed;
}

export function toPx(value?: number | string): string | undefined {
  if (value == null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : String(value);
}

export function normalizeVariant(value: VariantProp | undefined): NormalizedVariant {
  if (value === 'fill') return 'solid';
  if (value === 'stroke') return 'outline';
  return (value as NormalizedVariant) ?? 'outline';
}

export function hasVariantKeys(value: unknown): value is IconVariants {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    (Object.prototype.hasOwnProperty.call(value, 'outline') ||
      Object.prototype.hasOwnProperty.call(value, 'solid'))
  );
}

export function pickVariantEntry<TSource>(
  entry: unknown,
  variant: NormalizedVariant,
  options?: {
    isVariantCandidate?: (candidate: unknown) => boolean;
  },
): TSource | undefined {
  const isVariantCandidate = options?.isVariantCandidate ?? hasVariantKeys;

  if (!isVariantCandidate(entry)) {
    return entry as TSource;
  }

  const variants = entry as IconVariants<TSource>;
  return variants[variant] ?? variants.outline ?? variants.solid;
}
