import type { PropType } from 'vue';
import { defineComponent, h } from 'vue';

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
  type IconsMap,
  type PortableIconSource,
  type VariantProp,
} from '@components/Icon/icon.shared';

export type VueIconSource = PortableIconSource;

export type VueIconProps = {
  name: string;
  icons?: IconsMap<VueIconSource>;
  variant?: VariantProp;
  size?: number | string;
  color?: string;
  title?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  viewBox?: string;
  style?: Record<string, string | number> | null;
};

function isDevEnvironment(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
}

function isPortableIconSource(value: unknown): value is VueIconSource {
  if (typeof value === 'string') {
    return true;
  }

  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.svg === 'string') {
    return true;
  }

  return Array.isArray(candidate.paths);
}

function renderInlineSvgWrapper(options: {
  markup: string;
  className: unknown;
  title?: string;
  style?: Record<string, string | number>;
  width?: unknown;
  height?: unknown;
  color?: unknown;
  ariaLabel?: string;
  ariaHidden?: boolean | 'true' | 'false';
  role?: string;
  attrs?: Record<string, unknown>;
}) {
  const wrapperStyle = {
    display: 'inline-block',
    lineHeight: 0,
    ...(options.width != null ? { width: options.width } : {}),
    ...(options.height != null ? { height: options.height } : {}),
    ...(options.color != null ? { color: options.color } : {}),
    ...(options.style ?? {}),
  };

  return h('span', {
    ...(options.attrs ?? {}),
    class: options.className,
    style: wrapperStyle,
    title: options.title,
    role: options.role,
    'aria-label': options.ariaLabel,
    'aria-hidden': options.ariaHidden,
    innerHTML: options.markup,
  });
}

export const FivraIconPreview = defineComponent({
  name: 'FivraIconPreview',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    icons: {
      type: Object as PropType<IconsMap<VueIconSource> | undefined>,
      default: undefined,
    },
    variant: {
      type: String as PropType<VariantProp | undefined>,
      default: 'outline',
    },
    size: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: 'm',
    },
    color: {
      type: String,
      default: 'text-secondary-interactive',
    },
    title: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    'aria-label': {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    'aria-hidden': {
      type: [Boolean, String] as PropType<boolean | 'true' | 'false' | undefined>,
      default: undefined,
    },
    viewBox: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    style: {
      type: Object as PropType<Record<string, string | number> | null>,
      default: null,
    },
  },
  setup(props, { attrs }) {
    return () => {
      const {
        class: attrsClass,
        style: attrsStyle,
        role: attrsRole,
        focusable: attrsFocusable,
        width: attrsWidth,
        height: attrsHeight,
        viewBox: attrsViewBox,
        fill: attrsFill,
        ...restAttrs
      } = attrs;

      const iconMap = (props.icons ?? (generatedIcons as unknown as IconsMap<VueIconSource>)) as IconsMap<VueIconSource>;
      const entry = iconMap?.[props.name];
      const source = pickVariantEntry<VueIconSource>(entry, normalizeVariant(props.variant), {
        isVariantCandidate: (candidate) => hasVariantKeys(candidate),
      });

      if (!source) {
        if (isDevEnvironment()) {
          // eslint-disable-next-line no-console
          console.warn(`[Icon] Unknown icon: "${props.name}"`);
        }

        return null;
      }

      if (!isPortableIconSource(source)) {
        if (isDevEnvironment()) {
          // eslint-disable-next-line no-console
          console.warn(`[Icon] Unsupported icon source for "${props.name}"`, source);
        }

        return null;
      }

      const ariaLabel = props['aria-label'];
      const ariaHidden = props['aria-hidden'] ?? !(ariaLabel || props.title);
      const role = (attrsRole as string | undefined) ?? (ariaLabel || props.title ? 'img' : 'presentation');

      const resolvedSize = resolveIconSize(props.size);
      const resolvedColor = resolveIconColor(props.color);
      const computedSize = toPx(resolvedSize);
      const isTokenSize = typeof resolvedSize === 'string';

      const providedWidth = attrsWidth;
      const providedHeight = attrsHeight;

      const attrStyle = (attrsStyle ?? undefined) as Record<string, string | number> | undefined;
      const existingStyle = props.style ?? undefined;
      const mergedStyle =
        isTokenSize && computedSize
          ? {
              ...(attrStyle ?? {}),
              ...(existingStyle ?? {}),
              ...(attrStyle?.width == null && existingStyle?.width == null && providedWidth == null
                ? { width: computedSize }
                : {}),
              ...(attrStyle?.height == null && existingStyle?.height == null && providedHeight == null
                ? { height: computedSize }
                : {}),
            }
          : {
              ...(attrStyle ?? {}),
              ...(existingStyle ?? {}),
            };

      const baseSvgProps = {
        ...restAttrs,
        width: providedWidth ?? (isTokenSize ? undefined : computedSize),
        height: providedHeight ?? (isTokenSize ? undefined : computedSize),
        color: resolvedColor,
        fill: attrsFill ?? 'currentColor',
        viewBox: props.viewBox ?? (attrsViewBox as string | undefined) ?? DEFAULT_VIEWBOX,
        xmlns: 'http://www.w3.org/2000/svg',
        class: attrsClass,
        style: mergedStyle,
        role,
        'aria-label': ariaLabel,
        'aria-hidden': ariaHidden,
        focusable: attrsFocusable ?? false,
        title: props.title,
      };

      if (typeof source === 'string') {
        if (isSvgMarkup(source)) {
          return renderInlineSvgWrapper({
            markup: source,
            className: attrsClass,
            title: props.title,
            style: mergedStyle,
            width: baseSvgProps.width,
            height: baseSvgProps.height,
            color: baseSvgProps.color,
            role,
            ariaLabel,
            ariaHidden,
            attrs: restAttrs as Record<string, unknown>,
          });
        }

        return h('svg', baseSvgProps, [h('path', { d: source })]);
      }

      const iconObject = source as IconPaths | IconSvg;

      if (typeof (iconObject as IconSvg).svg === 'string') {
        return renderInlineSvgWrapper({
          markup: (iconObject as IconSvg).svg,
          className: attrsClass,
          title: props.title,
          style: mergedStyle,
          width: baseSvgProps.width,
          height: baseSvgProps.height,
          color: baseSvgProps.color,
          role,
          ariaLabel,
          ariaHidden,
          attrs: restAttrs as Record<string, unknown>,
        });
      }

      if (Array.isArray((iconObject as IconPaths).paths)) {
        const iconPaths = (iconObject as IconPaths).paths;
        const resolvedViewBox = (iconObject as IconPaths).viewBox ?? baseSvgProps.viewBox;

        return h(
          'svg',
          {
            ...baseSvgProps,
            viewBox: resolvedViewBox,
          },
          iconPaths.map((entry: IconPathEntry) => {
            if (typeof entry === 'string') {
              return h('path', { d: entry });
            }

            return h('path', {
              d: entry.d,
              fillRule: entry.fillRule,
              clipRule: entry.clipRule,
            });
          }),
        );
      }

      if (isDevEnvironment()) {
        // eslint-disable-next-line no-console
        console.warn(`[Icon] Unsupported icon source for "${props.name}"`, source);
      }

      return null;
    };
  },
});
