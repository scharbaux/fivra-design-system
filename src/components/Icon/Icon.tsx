import React, { forwardRef, isValidElement } from 'react';

import { icons as generatedIcons } from '@shared/icons/icons.generated';
import {
  DEFAULT_VIEWBOX,
  hasVariantKeys,
  isSvgMarkup,
  normalizeVariant,
  pickVariantEntry,
  resolveIconColor,
  resolveIconSize,
  toPx,
  type IconPathEntry,
  type IconPaths,
  type IconSvg,
  type IconVariants as SharedIconVariants,
  type IconsMap as SharedIconsMap,
  type PortableIconSource,
  type VariantProp,
} from './icon.shared';

export type { IconPathEntry, IconPaths, IconSvg } from './icon.shared';

export type IconElement = React.ReactElement<React.SVGProps<SVGSVGElement>>;
export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export type IconSource = IconComponent | IconElement | PortableIconSource;
export type IconVariants = SharedIconVariants<IconSource>;
export type IconsMap = SharedIconsMap<IconSource>;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'stroke' | 'strokeWidth'> {
  name: string;
  icons?: IconsMap;
  // Accept common aliases: 'stroke' -> 'outline', 'fill' -> 'solid'
  variant?: VariantProp;
  size?: number | string;
  color?: string;
  title?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  viewBox?: string;
}

function isComponent(x: unknown): x is IconComponent {
  return typeof x === 'function';
}

const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
  const {
    name,
    icons = (generatedIcons as unknown) as IconsMap,
    variant = 'outline',
    size = 'm',
    color = 'text-secondary-interactive',
    title,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    viewBox: viewBoxProp,
    ...svgProps
  } = props;

  const resolvedSize = resolveIconSize(size);
  const resolvedColor = resolveIconColor(color);

  const entry = icons ? (icons as any)[name] : undefined;
  const source = pickVariantEntry<IconSource>(entry, normalizeVariant(variant), {
    isVariantCandidate: (candidate) =>
      hasVariantKeys(candidate) && !isValidElement(candidate as any) && !isComponent(candidate),
  });

  if (!source) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[Icon] Unknown icon: "${name}"`);
    }
    return null;
  }

  const commonAriaProps: React.HTMLAttributes<HTMLElement> = {
    role: (svgProps as any).role ?? (ariaLabel || title ? 'img' : 'presentation'),
    'aria-label': ariaLabel,
    'aria-hidden': (ariaHidden as any) ?? !(ariaLabel || title),
    // @ts-expect-error: focusable is valid on SVG in browsers
    focusable: (svgProps as any).focusable ?? false,
  };

  const computedSize = toPx(resolvedSize);
  const isTokenSize = typeof resolvedSize === 'string';
  const providedWidth = (svgProps as any).width;
  const providedHeight = (svgProps as any).height;

  const existingStyle = style as React.CSSProperties | undefined;
  const mergedStyle: React.CSSProperties | undefined =
    isTokenSize && computedSize
      ? {
          ...existingStyle,
          ...(existingStyle?.width == null && providedWidth == null
            ? { width: computedSize }
            : {}),
          ...(existingStyle?.height == null && providedHeight == null
            ? { height: computedSize }
            : {}),
        }
      : existingStyle;

  // Default to filled shapes for both variants to preserve
  // flattened outlines exported from design tools.
  const defaultFill = (svgProps as any).fill ?? 'currentColor';

  const baseSvgProps: React.SVGProps<SVGSVGElement> = {
    width: providedWidth ?? (isTokenSize ? undefined : computedSize),
    height: providedHeight ?? (isTokenSize ? undefined : computedSize),
    color: resolvedColor,
    fill: defaultFill,
    viewBox: (viewBoxProp as any) ?? (svgProps as any).viewBox ?? DEFAULT_VIEWBOX,
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    style: mergedStyle,
    ref: ref as any,
    ...(commonAriaProps as any),
  };

  // 1) React component
  if (isComponent(source)) {
    const Cmp = source as IconComponent;
    return <Cmp {...(baseSvgProps as any)} />;
  }

  // 2) React element
  if (isValidElement(source)) {
    return React.cloneElement(source as IconElement, {
      ...(baseSvgProps as any),
      ...(source as IconElement).props,
      ref,
    });
  }

  // 3) String: either full <svg>...</svg> or a path data string
  if (typeof source === 'string') {
    if (isSvgMarkup(source)) {
      const wrapperStyle: React.CSSProperties = {
        display: 'inline-block',
        lineHeight: 0,
        ...(baseSvgProps.width ? { width: baseSvgProps.width as any } : {}),
        ...(baseSvgProps.height ? { height: baseSvgProps.height as any } : {}),
        color: baseSvgProps.color as any,
        ...(baseSvgProps.style || {}),
      };
      return (
        <span
          {...(commonAriaProps as any)}
          className={className}
          style={wrapperStyle}
          title={title}
          ref={ref as any}
          dangerouslySetInnerHTML={{ __html: source }}
        />
      );
    }

    // Assume it's a path data string
    return (
      <svg {...(baseSvgProps as any)} title={title}>
        <path d={source} />
      </svg>
    );
  }

  // 4) Object forms
  if (source && typeof source === 'object') {
    const s = source as IconPaths | IconSvg;
    if (typeof (s as IconSvg).svg === 'string') {
      const wrapperStyle: React.CSSProperties = {
        display: 'inline-block',
        lineHeight: 0,
        ...(baseSvgProps.width ? { width: baseSvgProps.width as any } : {}),
        ...(baseSvgProps.height ? { height: baseSvgProps.height as any } : {}),
        color: baseSvgProps.color as any,
        ...(baseSvgProps.style || {}),
      };
      return (
        <span
          {...(commonAriaProps as any)}
          className={className}
          style={wrapperStyle}
          title={title}
          ref={ref as any}
          dangerouslySetInnerHTML={{ __html: (s as IconSvg).svg }}
        />
      );
    }

    if (Array.isArray((s as IconPaths).paths)) {
      const vb = (s as IconPaths).viewBox ?? baseSvgProps.viewBox;
      return (
        <svg {...(baseSvgProps as any)} viewBox={vb} title={title}>
          {(s as IconPaths).paths.map((entry, i) => {
            if (typeof entry === 'string') {
              return <path key={i} d={entry} />;
            }
            const e = entry as { d: string; fillRule?: 'evenodd' | 'nonzero'; clipRule?: 'evenodd' | 'nonzero' };
            return <path key={i} d={e.d} fillRule={e.fillRule} clipRule={e.clipRule} />;
          })}
        </svg>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`[Icon] Unsupported icon source for "${name}"`, source);
  }
  return null;
});

export default Icon;
