import type { PropType } from "vue";
import { computed, defineComponent, h } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import { FivraBoxPreview } from "./Box.preview";
import {
  DEFAULT_TYPOGRAPHY_VARIANT,
  TYPOGRAPHY_CLASS_NAME,
  TYPOGRAPHY_VARIANTS,
  type TypographyVariant,
  ensureTypographyStyles,
} from "@components/Typography/typography.styles";

ensureTypographyStyles();

type VueTypographyStoryArgs = {
  variant?: TypographyVariant;
  truncate?: boolean;
  noWrap?: boolean;
  as?: string;
  className?: string;
  children?: string;
  style?: Record<string, string> | null;
};

const VARIANT_DEFAULT_ELEMENTS: Record<TypographyVariant, string> = {
  "heading-1": "h1",
  "heading-2": "h2",
  "heading-3": "h3",
  "body-1": "p",
  "body-1-medium": "p",
  "body-1-strong": "p",
  "body-2": "p",
  "body-2-strong": "p",
  "body-2-link": "p",
  "body-2-long": "p",
  "body-3": "p",
  "caption-1": "span",
  "caption-1-strong": "span",
};

function resolveDefaultElement(variant: TypographyVariant): string {
  return VARIANT_DEFAULT_ELEMENTS[variant] ?? "p";
}

const FivraTypographyPreview = defineComponent({
  name: "FivraTypographyPreview",
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<TypographyVariant>,
      default: DEFAULT_TYPOGRAPHY_VARIANT,
    },
    truncate: { type: Boolean, default: false },
    noWrap: { type: Boolean, default: false },
    as: { type: String as PropType<string | undefined>, default: undefined },
    className: { type: String as PropType<string | undefined>, default: undefined },
    children: { type: String as PropType<string | undefined>, default: undefined },
    style: {
      type: Object as PropType<Record<string, string> | null>,
      default: null,
    },
  },
  setup(props, { attrs, slots }) {
    // Ensure iframe runtime always has Typography token styles before render.
    ensureTypographyStyles();

    const resolvedVariant = computed(() =>
      TYPOGRAPHY_VARIANTS.includes(props.variant)
        ? props.variant
        : DEFAULT_TYPOGRAPHY_VARIANT,
    );

    const resolvedElement = computed(() => props.as ?? resolveDefaultElement(resolvedVariant.value));

    return () => {
      const { class: attrsClass, style: attrsStyle, ...restAttrs } = attrs;
      const className = [TYPOGRAPHY_CLASS_NAME, props.className, attrsClass]
        .filter((value) => Boolean(value))
        .join(" ");
      const mergedStyle = attrsStyle
        ? { ...(props.style ?? {}), ...(attrsStyle as Record<string, string>) }
        : props.style ?? undefined;

      return h(
        resolvedElement.value,
        {
          ...restAttrs,
          class: className,
          style: mergedStyle,
          "data-variant": resolvedVariant.value,
          "data-truncate": props.truncate ? "true" : undefined,
          "data-nowrap": props.noWrap ? "true" : undefined,
        },
        slots.default ? slots.default() : props.children,
      );
    };
  },
});

const defaultRender = (args: VueTypographyStoryArgs) => ({
  components: { FivraTypographyPreview },
  setup() {
    return { args };
  },
  template: `<FivraTypographyPreview v-bind="args">{{ args.children }}</FivraTypographyPreview>`,
});

const BODY_COPY_SOURCE = `<FivraTypographyPreview variant="body-1">
  Use body variants for paragraphs, legal copy, and supporting descriptions. Engage tokens control
  font family, weight, and letter spacing.
</FivraTypographyPreview>`;

const HEADINGS_SOURCE = `<FivraBoxPreview display="grid" gap="spacing-m">
  <FivraTypographyPreview variant="heading-1">Heading 1</FivraTypographyPreview>
  <FivraTypographyPreview variant="heading-2">Heading 2</FivraTypographyPreview>
  <FivraTypographyPreview variant="heading-3">Heading 3</FivraTypographyPreview>
</FivraBoxPreview>`;

const EMPHASIS_AND_LINKS_SOURCE = `<FivraBoxPreview display="grid" gap="spacing-s">
  <FivraTypographyPreview variant="body-1-strong">Body 1 strong emphasizes supporting copy.</FivraTypographyPreview>
  <FivraTypographyPreview variant="body-2-strong">Body 2 strong with compact letter spacing.</FivraTypographyPreview>
  <FivraTypographyPreview variant="body-2-link" as="a" href="#">
    Body 2 link uses interactive tokens and can render as an anchor.
  </FivraTypographyPreview>
  <FivraTypographyPreview variant="caption-1">Caption 1 suits tertiary UI metadata.</FivraTypographyPreview>
</FivraBoxPreview>`;

const TRUNCATION_SOURCE = `<FivraTypographyPreview
  truncate
  :style="{ maxWidth: '220px', display: 'block' }"
>
  When truncate is enabled this sentence will end with an ellipsis once the layout constrains its
  width beyond a single line of readable space.
</FivraTypographyPreview>`;

const NO_WRAP_SOURCE = `<FivraTypographyPreview noWrap>
  No wrap keeps inline copy on a single line without trimming the text.
</FivraTypographyPreview>`;

const meta: Meta<VueTypographyStoryArgs> = {
  title: "Atomics/Typography",
  id: "atomics-typography-vue",
  component: FivraTypographyPreview,
  tags: ["autodocs"],
  args: {
    children: "Fivra design tokens keep typography consistent across platforms.",
    variant: "body-1",
  },
  argTypes: {
    variant: {
      control: "select",
      options: TYPOGRAPHY_VARIANTS,
      description:
        "Maps to Engage typography tokens (e.g., `--typographyHeading1FontSize`, `--typographyBody2LetterSpacing`).",
    },
    truncate: {
      control: "boolean",
      description: "Applies `text-overflow: ellipsis` and related data attributes for overflow handling.",
      table: { category: "Layout" },
    },
    noWrap: {
      control: "boolean",
      description: "Prevents wrapping without applying overflow truncation styles.",
      table: { category: "Layout" },
    },
    as: {
      control: false,
      description:
        "Override the rendered element. Headings default to semantic `<h1>`–`<h3>` tags while body text renders paragraphs.",
      table: { category: "Accessibility" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Token-backed typography primitive that forwards native text attributes while aligning React adapters with future Angular and Vue implementations.",
      },
    },
  },
  render: defaultRender,
};

export default meta;

type Story = StoryObj<VueTypographyStoryArgs>;

export const BodyCopy: Story = {
  args: {
    children:
      "Use body variants for paragraphs, legal copy, and supporting descriptions. Engage tokens control font family, weight, and letter spacing.",
    variant: "body-1",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: BODY_COPY_SOURCE,
      },
    },
  },
};

export const Headings: Story = {
  render: () => ({
    components: { FivraBoxPreview, FivraTypographyPreview },
    template: `
      <FivraBoxPreview display="grid" gap="spacing-m">
        <FivraTypographyPreview variant="heading-1">Heading 1</FivraTypographyPreview>
        <FivraTypographyPreview variant="heading-2">Heading 2</FivraTypographyPreview>
        <FivraTypographyPreview variant="heading-3">Heading 3</FivraTypographyPreview>
      </FivraBoxPreview>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: HEADINGS_SOURCE,
      },
      description: {
        story:
          "Heading variants inherit semantic `<h1>`–`<h3>` elements by default so screen readers announce appropriate structure.",
      },
    },
  },
};

export const EmphasisAndLinks: Story = {
  render: () => ({
    components: { FivraBoxPreview, FivraTypographyPreview },
    template: `
      <FivraBoxPreview display="grid" gap="spacing-s">
        <FivraTypographyPreview variant="body-1-strong">Body 1 strong emphasizes supporting copy.</FivraTypographyPreview>
        <FivraTypographyPreview variant="body-2-strong">Body 2 strong with compact letter spacing.</FivraTypographyPreview>
        <FivraTypographyPreview variant="body-2-link" as="a" href="#">
          Body 2 link uses interactive tokens and can render as an anchor.
        </FivraTypographyPreview>
        <FivraTypographyPreview variant="caption-1">Caption 1 suits tertiary UI metadata.</FivraTypographyPreview>
      </FivraBoxPreview>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: EMPHASIS_AND_LINKS_SOURCE,
      },
      description: {
        story:
          "Typography variants remain token-sourced, enabling emphasis styles, link treatments, and captions without redefining CSS per framework.",
      },
    },
  },
};

export const Truncation: Story = {
  args: {
    truncate: true,
    children:
      "When truncate is enabled this sentence will end with an ellipsis once the layout constrains its width beyond a single line of readable space.",
    style: {
      maxWidth: "220px",
      display: "block",
    },
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: TRUNCATION_SOURCE,
      },
      description: {
        story:
          "Toggle `truncate` to add ellipsis overflow handling. Combine with `noWrap` to prevent soft line breaks when truncation is not necessary.",
      },
    },
  },
};

export const NoWrap: Story = {
  args: {
    noWrap: true,
    children: "No wrap keeps inline copy on a single line without trimming the text.",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: NO_WRAP_SOURCE,
      },
    },
  },
};
