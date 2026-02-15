import type { PropType } from 'vue';
import { computed, defineComponent, h } from 'vue';

import { BOX_CLASS_NAME, ensureBoxStyles } from '@components/Box/box.styles';
import { createBoxStyles, type BoxStyleInput, type BoxSpacingValue } from '@components/Box/box.helpers';

export type VueBoxStoryArgs = BoxStyleInput & {
  as?: string;
  className?: string;
  style?: Record<string, string> | null;
};

const SPACE_VALUE_PROP = [String, Number] as unknown as PropType<BoxSpacingValue | undefined>;
const STRING_NUMBER_PROP = [String, Number] as unknown as PropType<string | number | undefined>;

ensureBoxStyles();

export const FivraBoxPreview = defineComponent({
  name: 'FivraBoxPreview',
  inheritAttrs: false,
  props: {
    as: { type: String, default: 'div' },
    className: { type: String, default: undefined },
    style: {
      type: Object as PropType<Record<string, string> | null>,
      default: null,
    },
    m: { type: SPACE_VALUE_PROP },
    mx: { type: SPACE_VALUE_PROP },
    my: { type: SPACE_VALUE_PROP },
    mt: { type: SPACE_VALUE_PROP },
    mr: { type: SPACE_VALUE_PROP },
    mb: { type: SPACE_VALUE_PROP },
    ml: { type: SPACE_VALUE_PROP },
    p: { type: SPACE_VALUE_PROP },
    px: { type: SPACE_VALUE_PROP },
    py: { type: SPACE_VALUE_PROP },
    pt: { type: SPACE_VALUE_PROP },
    pr: { type: SPACE_VALUE_PROP },
    pb: { type: SPACE_VALUE_PROP },
    pl: { type: SPACE_VALUE_PROP },
    gap: { type: SPACE_VALUE_PROP },
    rowGap: { type: SPACE_VALUE_PROP },
    columnGap: { type: SPACE_VALUE_PROP },
    display: { type: String as PropType<string | undefined> },
    flexDirection: { type: String as PropType<string | undefined> },
    justifyContent: { type: String as PropType<string | undefined> },
    alignItems: { type: String as PropType<string | undefined> },
    flexWrap: { type: String as PropType<string | undefined> },
    backgroundColor: { type: String as PropType<string | undefined> },
    color: { type: String as PropType<string | undefined> },
    borderColor: { type: String as PropType<string | undefined> },
    borderRadius: { type: STRING_NUMBER_PROP },
    borderWidth: { type: STRING_NUMBER_PROP },
    boxShadow: { type: String as PropType<string | undefined> },
    width: { type: SPACE_VALUE_PROP },
    height: { type: SPACE_VALUE_PROP },
  },
  setup(props, { attrs, slots }) {
    const resolvedStyle = computed(() => {
      const baseStyle = createBoxStyles({
        m: props.m,
        mx: props.mx,
        my: props.my,
        mt: props.mt,
        mr: props.mr,
        mb: props.mb,
        ml: props.ml,
        p: props.p,
        px: props.px,
        py: props.py,
        pt: props.pt,
        pr: props.pr,
        pb: props.pb,
        pl: props.pl,
        gap: props.gap,
        rowGap: props.rowGap,
        columnGap: props.columnGap,
        display: props.display,
        flexDirection: props.flexDirection,
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flexWrap: props.flexWrap,
        backgroundColor: props.backgroundColor,
        color: props.color,
        borderColor: props.borderColor,
        borderRadius: props.borderRadius,
        borderWidth: props.borderWidth,
        boxShadow: props.boxShadow,
        width: props.width,
        height: props.height,
      });

      return props.style ? { ...baseStyle, ...props.style } : baseStyle;
    });

    return () => {
      const { class: attrsClass, style: attrsStyle, ...restAttrs } = attrs;
      const className = [BOX_CLASS_NAME, props.className, attrsClass]
        .filter((value) => Boolean(value))
        .join(' ');
      const mergedStyle = attrsStyle
        ? { ...resolvedStyle.value, ...(attrsStyle as Record<string, string>) }
        : resolvedStyle.value;

      return h(
        props.as || 'div',
        {
          ...restAttrs,
          class: className,
          style: mergedStyle,
        },
        slots.default ? slots.default() : undefined,
      );
    };
  },
});
