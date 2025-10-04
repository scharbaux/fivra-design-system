import type { PropType } from "vue";
import { computed, defineComponent, h } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";

import {
  BUTTON_CARET_CLASS,
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from "@components/Button/button.styles";
import {
  SEMANTIC_TONES,
  createButtonSemanticStyleFactories,
} from "@components/Button/story-helpers";
import { defineFivraButton } from "@web-components";

ensureButtonStyles();

const {
  createPrimarySemanticStyles,
  createSecondarySemanticStyles,
  createTertiarySemanticStyles,
} = createButtonSemanticStyleFactories<Record<string, string>>((overrides) => overrides);

type VueButtonStoryArgs = {
  children?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  hasLabel?: boolean | null;
  dropdown?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: Record<string, string> | null;
  ariaLabel?: string | null;
  ariaLabelledby?: string | null;
  ariaHaspopup?: string | null;
  ariaExpanded?: string | null;
  "aria-label"?: string;
  "aria-expanded"?: string;
  leadingIcon?: string | null;
  trailingIcon?: string | null;
  onClick?: (event: MouseEvent) => void;
};

const resolveStoryArgs = (args: VueButtonStoryArgs) => {
  const { "aria-label": ariaLabelAttr, "aria-expanded": ariaExpandedAttr, ...rest } = args;

  return {
    ...rest,
    ariaLabel: ariaLabelAttr ?? rest.ariaLabel ?? null,
    ariaExpanded: ariaExpandedAttr ?? rest.ariaExpanded ?? null,
  } satisfies VueButtonStoryArgs;
};

const FivraButtonPreview = defineComponent({
  name: "FivraButtonPreview",
  props: {
    children: { type: String, default: "Button" },
    variant: {
      type: String as PropType<ButtonVariant>,
      default: "primary",
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: "md",
    },
    fullWidth: { type: Boolean, default: false },
    iconOnly: { type: Boolean, default: false },
    hasLabel: { type: Boolean as PropType<boolean | null>, default: null },
    dropdown: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: {
      type: String as PropType<"button" | "submit" | "reset">,
      default: "button",
    },
    style: {
      type: Object as PropType<Record<string, string> | null>,
      default: null,
    },
    ariaLabel: { type: String as PropType<string | null>, default: null },
    ariaLabelledby: { type: String as PropType<string | null>, default: null },
    ariaHaspopup: { type: String as PropType<string | null>, default: null },
    ariaExpanded: { type: String as PropType<string | null>, default: null },
    leadingIcon: { type: String as PropType<string | null>, default: null },
    trailingIcon: { type: String as PropType<string | null>, default: null },
    onClick: { type: Function as PropType<((event: MouseEvent) => void) | undefined> },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const resolvedHasLabel = computed(() => {
      if (props.hasLabel !== null && props.hasLabel !== undefined) {
        return props.hasLabel;
      }

      if (props.iconOnly) {
        return false;
      }

      return Boolean(props.children?.trim?.());
    });

    const resolvedAriaHaspopup = computed(() => {
      if (props.ariaHaspopup) {
        return props.ariaHaspopup;
      }

      return props.dropdown ? "menu" : null;
    });

    const resolvedAriaExpanded = computed(() => {
      if (props.ariaExpanded == null) {
        return undefined;
      }

      return props.ariaExpanded;
    });

    const handleClick = (event: MouseEvent) => {
      if (props.disabled || props.loading) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      emit("click", event);
      props.onClick?.(event);
    };

    return () =>
      h(
        "button",
        {
          class: BUTTON_CLASS_NAME,
          type: props.type,
          disabled: props.disabled || props.loading,
          "data-variant": props.variant ?? "primary",
          "data-size": props.size ?? "md",
          "data-full-width": props.fullWidth ? "true" : undefined,
          "data-icon-only": props.iconOnly ? "true" : undefined,
          "data-has-label": resolvedHasLabel.value ? "true" : "false",
          "data-dropdown": props.dropdown ? "true" : undefined,
          "data-loading": props.loading ? "true" : undefined,
          style: props.style ?? undefined,
          "aria-label": props.ariaLabel ?? undefined,
          "aria-labelledby": props.ariaLabelledby ?? undefined,
          "aria-haspopup": resolvedAriaHaspopup.value ?? undefined,
          "aria-expanded": resolvedAriaExpanded.value,
          "aria-busy": props.loading ? "true" : undefined,
          onClick: handleClick,
        },
        [
          props.loading
            ? h("span", {
                class: BUTTON_SPINNER_CLASS,
                "aria-hidden": "true",
              })
            : null,
          h(
            "span",
            {
              class: `${BUTTON_ICON_CLASS} ${BUTTON_LEADING_ICON_CLASS}`,
              "aria-hidden": "true",
              "data-empty": props.leadingIcon ? undefined : "true",
            },
            props.leadingIcon ?? null,
          ),
          h(
            "span",
            {
              class: BUTTON_LABEL_CLASS,
              "data-empty": resolvedHasLabel.value ? undefined : "true",
            },
            resolvedHasLabel.value ? props.children ?? "" : null,
          ),
          h(
            "span",
            {
              class: `${BUTTON_ICON_CLASS} ${BUTTON_TRAILING_ICON_CLASS}`,
              "aria-hidden": "true",
              "data-empty": props.trailingIcon ? undefined : "true",
            },
            props.trailingIcon ?? null,
          ),
          props.dropdown
            ? h("span", {
                class: BUTTON_CARET_CLASS,
                "aria-hidden": "true",
              })
            : null,
        ],
      );
  },
});

const defaultRender = (args: VueButtonStoryArgs) => {
  const resolvedArgs = resolveStoryArgs(args);

  return {
    components: { FivraButtonPreview },
    setup() {
      return { args: resolvedArgs };
    },
    template: `<FivraButtonPreview v-bind="args" />`,
  };
};

const meta: Meta<VueButtonStoryArgs> = {
  title: "Atomics/Button",
  id: "atomics-button-vue",
  component: FivraButtonPreview,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "primary",
  },
  argTypes: {
    onClick: { action: "clicked" },
    leadingIcon: {
      control: false,
      description: "Optional icon rendered before the label.",
    },
    trailingIcon: {
      control: false,
      description: "Optional icon rendered after the label.",
    },
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "tertiary"],
      description:
        "Visual treatment of the button mapped to `--backgroundPrimaryInteractive`, `--backgroundNeutral0`, and transparent tiers.",
      table: { category: "Appearance" },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Sizing scale for padding and typography.",
      table: { category: "Sizing" },
    },
    fullWidth: {
      control: "boolean",
      description: "Stretches the button to fill its container width.",
      table: { category: "Layout" },
    },
    iconOnly: {
      control: "boolean",
      description: "Removes the visible label and switches to `--radiusMax`. Provide `aria-label` for accessibility.",
      table: { category: "Appearance" },
    },
    hasLabel: {
      control: "boolean",
      description:
        "Override automatic label detection when rendering screen-reader-only copy. When unset, adapters trim the rendered children to determine whether a visible label exists.",
      table: { category: "Accessibility" },
    },
    dropdown: {
      control: "boolean",
      description:
        "Appends a disclosure caret for menu triggers and defaults `aria-haspopup=\"menu\"`. Provide `aria-expanded` when you control disclosure state.",
      table: { category: "Appearance" },
    },
    loading: {
      control: "boolean",
      description: "Displays a spinner with `aria-busy` set on the underlying `<button>`.",
      table: { category: "State" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Accessible button primitive with primary, secondary, and tertiary variants mapped directly to the spec token palette. Supports icons, dropdown affordances, loading states, and forwards native button attributes.",
      },
    },
  },
  render: defaultRender,
};

export default meta;

type Story = StoryObj<VueButtonStoryArgs>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary buttons emphasize the main action using '--backgroundPrimaryInteractive'. The default mixes keep brand overlays weighting the state layer and surface through `--fivra-button-hover-color`, `--fivra-button-active-color`, and `--fivra-button-focus-ring-color`.",
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary buttons pair `--backgroundNeutral0` with `--borderPrimaryInteractive` and now reweight their hover, active, and focus mixes so the accent receives the intensity percentage. The result keeps outline tiers neutral by default while adopting semantic hues when `--fivra-button-accent` is overridden.",
      },
    },
  },
};

export const Tertiary: Story = {
  args: {
    children: "Tertiary",
    variant: "tertiary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tertiary buttons stay transparent until interaction and mirror the secondary overlay logic so `--fivra-button-hover-color` and friends tint directly toward the accent color.",
      },
    },
  },
};

export const DisabledStates: Story = {
  render: () => ({
    components: { FivraButtonPreview },
    setup() {
      return {
        primaryArgs: { variant: "primary", disabled: true, children: "Primary" },
        secondaryArgs: { variant: "secondary", disabled: true, children: "Secondary" },
        tertiaryArgs: { variant: "tertiary", disabled: true, children: "Tertiary" },
      };
    },
    template: `
      <div
        style="
          display: flex;
          gap: calc(var(--spacingL) * 1px);
          align-items: center;
          flex-wrap: wrap;
        "
      >
        <FivraButtonPreview v-bind="primaryArgs" />
        <FivraButtonPreview v-bind="secondaryArgs" />
        <FivraButtonPreview v-bind="tertiaryArgs" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled states pull from `--backgroundPrimaryDisabled`, `--backgroundSecondaryDisabled`, and `--textPrimaryDisabled` ensuring consistent contrast and borders via `--borderPrimaryDisabled`.",
      },
    },
  },
};

export const SemanticOverrides: Story = {
  name: "Semantic Overrides",
  render: () => ({
    components: { FivraButtonPreview },
    setup() {
      return {
        tones: SEMANTIC_TONES,
        createPrimarySemanticStyles,
        createSecondarySemanticStyles,
        createTertiarySemanticStyles,
      };
    },
    template: `
      <div style="display: grid; gap: calc(var(--spacingM) * 1px);">
        <div style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;">
          <FivraButtonPreview
            v-for="tone in tones"
            :key="'primary-' + tone"
            variant="primary"
            :style="createPrimarySemanticStyles(tone)"
            :children="tone + ' Primary'"
          />
        </div>
        <div style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;">
          <FivraButtonPreview
            v-for="tone in tones"
            :key="'secondary-' + tone"
            variant="secondary"
            :style="createSecondarySemanticStyles(tone)"
            :children="tone + ' Secondary'"
          />
        </div>
        <div style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;">
          <FivraButtonPreview
            v-for="tone in tones"
            :key="'tertiary-' + tone"
            variant="tertiary"
            :style="createTertiarySemanticStyles(tone)"
            :children="tone + ' Tertiary'"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Setting the `--fivra-button-accent` custom property enables success, warning, and error palettes while the new per-variant color-mix state layers adapt automatically. Fallback variables keep neutral overlays for browsers without color-mix support.",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    children: "Download",
    leadingIcon: "⬇",
    trailingIcon: "→",
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates leading and trailing icon slots using the shared Icon component.",
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    children: "Responsive",
    variant: "primary",
  },
  render: (args) => {
    const resolvedArgs = resolveStoryArgs(args);

    return {
      components: { FivraButtonPreview },
      setup() {
        return {
          smallArgs: { ...resolvedArgs, size: "sm", children: "Small" },
          mediumArgs: { ...resolvedArgs, size: "md", children: "Medium" },
          largeArgs: { ...resolvedArgs, size: "lg", children: "Large" },
        };
      },
      template: `
        <div
          style="
            display: flex;
            gap: calc(var(--spacingL) * 1px);
            align-items: center;
            flex-wrap: wrap;
          "
        >
          <FivraButtonPreview v-bind="smallArgs" />
          <FivraButtonPreview v-bind="mediumArgs" />
          <FivraButtonPreview v-bind="largeArgs" />
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          "Small, medium, and large presets use explicit padding (12×4, 16×8, 24×12) with heights 24/32/40px and radii mapped to `--radiusXs`, `--radiusS`, and `--radiusM`.",
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    children: "Continue",
    fullWidth: true,
    variant: "primary",
  },
  render: (args) => {
    const resolvedArgs = resolveStoryArgs(args);

    return {
      components: { FivraButtonPreview },
      setup() {
        return { buttonArgs: resolvedArgs };
      },
      template: `
        <div style="width: 320px;">
          <FivraButtonPreview v-bind="buttonArgs" />
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story: "Full-width mode is useful for responsive layouts or stacked mobile actions.",
      },
    },
  },
};

export const Dropdown: Story = {
  args: {
    children: "Menu",
    dropdown: true,
    "aria-expanded": "false",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown mode adds a built-in caret, applies `aria-haspopup=\"menu\"` by default, and works with an `aria-expanded` override when the menu state is controlled externally.",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    children: "Saving...",
    loading: true,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Setting `loading` renders the centered spinner, sets `aria-busy`, and works alongside `disabled` to block duplicate submissions.",
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    children: undefined,
    leadingIcon: "→",
    "aria-label": "Next",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only buttons collapse to a circular hit area via `--radiusMax`. Remember to supply an accessible `aria-label`.",
      },
    },
  },
};

const ensureWebComponentDefined = () => {
  if (!customElements.get("fivra-button")) {
    defineFivraButton();
  }
};

export const WebComponent: Story = {
  name: "Web Component",
  render: () => {
    ensureWebComponentDefined();

    return {
      template: `
        <fivra-button variant="secondary" size="md" dropdown>
          <span slot="leading-icon" aria-hidden="true">★</span>
          Web component
        </fivra-button>
      `,
    };
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Custom element preview. Call `defineFivraButton()` before first render to register `<fivra-button>`.",
      },
    },
  },
};
