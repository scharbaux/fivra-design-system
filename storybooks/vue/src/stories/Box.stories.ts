import type { Meta, StoryObj } from '@storybook/vue3';

import {
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  ensureButtonStyles,
} from '@shared/button/button.styles';
import {
  backgroundColorTokenOptions,
  borderColorTokenOptions,
  borderWidthTokenOptions,
  radiusTokenOptions,
  shadowTokenOptions,
  spacingTokenOptions,
  textColorTokenOptions,
} from '@styles/themes/storybook-token-options.generated';
import { FivraBoxPreview, type VueBoxStoryArgs } from './Box.preview';

const DEFAULT_OPTION = '(default)';
const DEFAULT_MAPPING = { [DEFAULT_OPTION]: undefined } as const;
const ELEMENT_OPTIONS = ['div', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav', 'span'] as const;
const DISPLAY_OPTIONS = ['block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'] as const;
const FLEX_DIRECTION_OPTIONS = ['row', 'row-reverse', 'column', 'column-reverse'] as const;
const JUSTIFY_CONTENT_OPTIONS = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const;
const ALIGN_ITEMS_OPTIONS = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] as const;
const FLEX_WRAP_OPTIONS = ['nowrap', 'wrap', 'wrap-reverse'] as const;
const SPACING_OPTIONS = [DEFAULT_OPTION, ...spacingTokenOptions] as const;
const BACKGROUND_COLOR_OPTIONS = [DEFAULT_OPTION, ...backgroundColorTokenOptions] as const;
const TEXT_COLOR_OPTIONS = [DEFAULT_OPTION, ...textColorTokenOptions] as const;
const BORDER_COLOR_OPTIONS = [DEFAULT_OPTION, ...borderColorTokenOptions] as const;
const RADIUS_OPTIONS = [DEFAULT_OPTION, ...radiusTokenOptions] as const;
const BORDER_WIDTH_OPTIONS = [DEFAULT_OPTION, ...borderWidthTokenOptions] as const;
const SHADOW_OPTIONS = [DEFAULT_OPTION, ...shadowTokenOptions] as const;

ensureButtonStyles();

const PADDING_AND_MARGIN_TOKENS_SOURCE = `<FivraBoxPreview backgroundColor="background-neutral-6" p="spacing-xl" gap="spacing-m" display="grid">
  <FivraBoxPreview backgroundColor="background-neutral-0" p="spacing-m" borderRadius="radius-m">
    Base padding applied via <code>p</code> with Engage spacing tokens.
  </FivraBoxPreview>
  <FivraBoxPreview backgroundColor="background-neutral-0" p="spacing-m" borderRadius="radius-m" mb="spacing-s">
    Bottom margin tokens like <code>mb</code> space stacked content consistently.
  </FivraBoxPreview>
  <FivraBoxPreview backgroundColor="background-neutral-0" px="spacing-l" py="spacing-s" borderRadius="radius-m">
    Axis shorthands (<code>px</code>, <code>py</code>) cascade until side-specific overrides are provided.
  </FivraBoxPreview>
</FivraBoxPreview>`;

const FLEX_ALIGNMENT_SOURCE = `<FivraBoxPreview
  display="flex"
  gap="spacing-l"
  alignItems="center"
  justifyContent="space-between"
  p="spacing-m"
  backgroundColor="background-neutral-0"
  borderRadius="radius-l"
>
  <FivraBoxPreview backgroundColor="background-neutral-6" p="spacing-s" borderRadius="radius-s">
    Start
  </FivraBoxPreview>
  <FivraBoxPreview display="flex" gap="spacing-s" alignItems="center">
    <FivraBoxPreview
      backgroundColor="background-primary-interactive"
      color="background-neutral-0"
      p="spacing-xs"
      borderRadius="radius-xs"
      width="200px"
      display="flex"
      alignItems="flex-start"
    >
      Flex child
    </FivraBoxPreview>
    <FivraBoxPreview
      backgroundColor="background-secondary-interactive"
      color="text-neutral-6"
      p="spacing-xs"
      borderRadius="radius-xs"
      width="200px"
      display="flex"
      justifyContent="center"
    >
      Aligns center
    </FivraBoxPreview>
  </FivraBoxPreview>
</FivraBoxPreview>`;

const BACKGROUND_UTILITIES_SOURCE = `<FivraBoxPreview display="grid" gap="spacing-m" p="spacing-m" backgroundColor="background-neutral-6" borderRadius="radius-l">
  <FivraBoxPreview backgroundColor="background-primary-interactive" color="text-neutral-6" p="spacing-m" borderRadius="radius-m">
    Primary background
  </FivraBoxPreview>
  <FivraBoxPreview backgroundColor="background-secondary-interactive" color="text-neutral-6" p="spacing-m" borderRadius="radius-m">
    Secondary background
  </FivraBoxPreview>
  <FivraBoxPreview backgroundColor="background-tertiary-interactive" color="text-neutral-1" p="spacing-m" borderRadius="radius-m">
    Tertiary background
  </FivraBoxPreview>
</FivraBoxPreview>`;

const NESTED_COMPOSITION_SOURCE = `<FivraBoxPreview
  display="grid"
  gap="spacing-l"
  p="spacing-l"
  backgroundColor="background-neutral-6"
  borderRadius="radius-l"
  justifyContent="center"
>
  <FivraBoxPreview
    display="grid"
    gap="spacing-l"
    backgroundColor="background-neutral-0"
    borderRadius="radius-m"
    p="spacing-xl"
    width="400px"
  >
    <FivraBoxPreview display="flex" justifyContent="space-between" alignItems="center">
      <strong>Card title</strong>
      <button
        type="button"
        class="${BUTTON_CLASS_NAME}"
        data-variant="tertiary"
        data-size="md"
        data-icon-only="true"
        data-has-label="false"
        aria-label="Close modal"
      >
        <span class="${BUTTON_ICON_CLASS}" data-empty="false">×</span>
        <span class="${BUTTON_LABEL_CLASS}" data-empty="true"></span>
      </button>
    </FivraBoxPreview>

    <FivraBoxPreview color="text-neutral-2">
      Reusable layout primitive enables nested shells without bespoke wrappers, ensuring consistent
      spacing and token usage.
    </FivraBoxPreview>

    <FivraBoxPreview
      display="flex"
      gap="spacing-s"
      justifyContent="space-between"
      :style="{ borderTop: '1px solid var(--borderNeutral5)' }"
      pt="spacing-m"
    >
      <button
        type="button"
        class="${BUTTON_CLASS_NAME}"
        data-variant="secondary"
        data-size="md"
        data-has-label="true"
      >
        <span class="${BUTTON_LABEL_CLASS}" data-empty="false">Cancel</span>
      </button>
      <button
        type="button"
        class="${BUTTON_CLASS_NAME}"
        data-variant="primary"
        data-size="md"
        data-has-label="true"
      >
        <span class="${BUTTON_LABEL_CLASS}" data-empty="false">Primary Action</span>
      </button>
    </FivraBoxPreview>
  </FivraBoxPreview>
</FivraBoxPreview>`;

const meta: Meta<VueBoxStoryArgs> = {
  title: 'Atomics/Box',
  id: 'atomics-box-vue',
  component: FivraBoxPreview,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ELEMENT_OPTIONS,
      description: 'Polymorphic element tag rendered by the Box primitive.',
      table: { category: 'Layout' },
    },
    display: {
      control: 'select',
      options: DISPLAY_OPTIONS,
      description: 'Sets the CSS display property for the rendered element.',
      table: { category: 'Layout' },
    },
    flexDirection: {
      control: 'select',
      options: FLEX_DIRECTION_OPTIONS,
      description: 'Flex direction utility when `display` is `flex` or `inline-flex`.',
      table: { category: 'Layout' },
    },
    justifyContent: {
      control: 'select',
      options: JUSTIFY_CONTENT_OPTIONS,
      description: 'Main-axis alignment utility for flex or grid layouts.',
      table: { category: 'Layout' },
    },
    alignItems: {
      control: 'select',
      options: ALIGN_ITEMS_OPTIONS,
      description: 'Cross-axis alignment utility for flex or grid layouts.',
      table: { category: 'Layout' },
    },
    flexWrap: {
      control: 'select',
      options: FLEX_WRAP_OPTIONS,
      description: 'Flex wrapping behavior when `display` is `flex`.',
      table: { category: 'Layout' },
    },
    p: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Padding shorthand accepting theme spacing tokens (e.g., `spacing-m`).',
      table: { category: 'Spacing' },
    },
    m: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Margin shorthand accepting theme spacing tokens (e.g., `spacing-s`).',
      table: { category: 'Spacing' },
    },
    mx: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Horizontal margin utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    my: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Vertical margin utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    mt: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Top margin utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    mr: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Right margin utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    mb: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Bottom margin utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    ml: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Left margin utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    px: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Horizontal padding utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    py: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Vertical padding utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    pt: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Top padding utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    pr: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Right padding utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    pb: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Bottom padding utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    pl: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Left padding utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    gap: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Gap utility accepting theme spacing tokens (e.g., `spacing-s`).',
      table: { category: 'Spacing' },
    },
    rowGap: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Row gap utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    columnGap: {
      control: 'select',
      options: SPACING_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Column gap utility accepting theme spacing tokens.',
      table: { category: 'Spacing' },
    },
    backgroundColor: {
      control: 'select',
      options: BACKGROUND_COLOR_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Background fill accepting theme tokens like `background-neutral-0`.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: TEXT_COLOR_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Foreground/text color accepting theme tokens like `text-neutral-1`.',
      table: { category: 'Appearance' },
    },
    borderColor: {
      control: 'select',
      options: BORDER_COLOR_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Border color accepting theme tokens like `border-primary-interactive`.',
      table: { category: 'Appearance' },
    },
    borderRadius: {
      control: 'select',
      options: RADIUS_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Corner radius token (e.g., `radius-m`).',
      table: { category: 'Appearance' },
    },
    borderWidth: {
      control: 'select',
      options: BORDER_WIDTH_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Border width token (e.g., `border-width-s`).',
      table: { category: 'Appearance' },
    },
    boxShadow: {
      control: 'select',
      options: SHADOW_OPTIONS,
      mapping: DEFAULT_MAPPING,
      description: 'Shadow preset token (e.g., `shadow-m`).',
      table: { category: 'Appearance' },
    },
    width: {
      control: 'text',
      description: 'Width utility accepting CSS values or spacing tokens.',
      table: { category: 'Layout' },
    },
    height: {
      control: 'text',
      description: 'Height utility accepting CSS values or spacing tokens.',
      table: { category: 'Layout' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Low-level layout primitive exposing spacing shorthands, layout helpers, and token-backed color utilities. Useful for composing stories and surface shells without bespoke wrappers.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<VueBoxStoryArgs>;

export const PaddingAndMarginTokens: Story = {
  name: 'Padding & margin tokens',
  render: () => ({
    components: { FivraBoxPreview },
    template: `
      <FivraBoxPreview backgroundColor="background-neutral-6" p="spacing-xl" gap="spacing-m" display="grid">
        <FivraBoxPreview backgroundColor="background-neutral-0" p="spacing-m" borderRadius="radius-m">
          Base padding applied via <code>p</code> with Engage spacing tokens.
        </FivraBoxPreview>
        <FivraBoxPreview backgroundColor="background-neutral-0" p="spacing-m" borderRadius="radius-m" mb="spacing-s">
          Bottom margin tokens like <code>mb</code> space stacked content consistently.
        </FivraBoxPreview>
        <FivraBoxPreview backgroundColor="background-neutral-0" px="spacing-l" py="spacing-s" borderRadius="radius-m">
          Axis shorthands (<code>px</code>, <code>py</code>) cascade until side-specific overrides are provided.
        </FivraBoxPreview>
      </FivraBoxPreview>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: PADDING_AND_MARGIN_TOKENS_SOURCE,
      },
      description: {
        story:
          'Spacing props map to Engage tokens such as `spacing-xl` or `spacing-s`, converting them to pixel values via CSS custom properties.',
      },
    },
  },
};

export const FlexAlignment: Story = {
  render: () => ({
    components: { FivraBoxPreview },
    template: `
      <FivraBoxPreview
        display="flex"
        gap="spacing-l"
        alignItems="center"
        justifyContent="space-between"
        p="spacing-m"
        backgroundColor="background-neutral-0"
        borderRadius="radius-l"
      >
        <FivraBoxPreview backgroundColor="background-neutral-6" p="spacing-s" borderRadius="radius-s">
          Start
        </FivraBoxPreview>
        <FivraBoxPreview display="flex" gap="spacing-s" alignItems="center">
          <FivraBoxPreview
            backgroundColor="background-primary-interactive"
            color="background-neutral-0"
            p="spacing-xs"
            borderRadius="radius-xs"
            width="200px"
            display="flex"
            alignItems="flex-start"
          >
            Flex child
          </FivraBoxPreview>
          <FivraBoxPreview
            backgroundColor="background-secondary-interactive"
            color="text-neutral-6"
            p="spacing-xs"
            borderRadius="radius-xs"
            width="200px"
            display="flex"
            justifyContent="center"
          >
            Aligns center
          </FivraBoxPreview>
        </FivraBoxPreview>
      </FivraBoxPreview>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: FLEX_ALIGNMENT_SOURCE,
      },
      description: {
        story:
          'Flexbox helpers (`display`, `justifyContent`, `alignItems`, `gap`) provide quick wrappers for Storybook controls and layout scaffolding.',
      },
    },
  },
};

export const BackgroundUtilities: Story = {
  render: () => ({
    components: { FivraBoxPreview },
    template: `
      <FivraBoxPreview display="grid" gap="spacing-m" p="spacing-m" backgroundColor="background-neutral-6" borderRadius="radius-l">
        <FivraBoxPreview backgroundColor="background-primary-interactive" color="text-neutral-6" p="spacing-m" borderRadius="radius-m">
          Primary background
        </FivraBoxPreview>
        <FivraBoxPreview backgroundColor="background-secondary-interactive" color="text-neutral-6" p="spacing-m" borderRadius="radius-m">
          Secondary background
        </FivraBoxPreview>
        <FivraBoxPreview backgroundColor="background-tertiary-interactive" color="text-neutral-1" p="spacing-m" borderRadius="radius-m">
          Tertiary background
        </FivraBoxPreview>
      </FivraBoxPreview>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: BACKGROUND_UTILITIES_SOURCE,
      },
      description: {
        story:
          'Background and text props accept Engage token strings, resolving them to `var(--tokenName)` references for consistent theme usage.',
      },
    },
  },
};

export const NestedComposition: Story = {
  render: () => ({
    components: { FivraBoxPreview },
    template: `
      <FivraBoxPreview
        display="grid"
        gap="spacing-l"
        p="spacing-l"
        backgroundColor="background-neutral-6"
        borderRadius="radius-l"
        justifyContent="center"
      >
        <FivraBoxPreview
          display="grid"
          gap="spacing-l"
          backgroundColor="background-neutral-0"
          borderRadius="radius-m"
          p="spacing-xl"
          width="400px"
        >
          <FivraBoxPreview display="flex" justifyContent="space-between" alignItems="center">
            <strong>Card title</strong>
            <button
              type="button"
              :class="buttonClassName"
              data-variant="tertiary"
              data-size="md"
              data-icon-only="true"
              data-has-label="false"
              aria-label="Close modal"
            >
              <span :class="buttonIconClassName" data-empty="false">×</span>
              <span :class="buttonLabelClassName" data-empty="true"></span>
            </button>
          </FivraBoxPreview>

          <FivraBoxPreview color="text-neutral-2">
            Reusable layout primitive enables nested shells without bespoke wrappers, ensuring consistent spacing and token usage.
          </FivraBoxPreview>

          <FivraBoxPreview
            display="flex"
            gap="spacing-s"
            justifyContent="space-between"
            :style="{ borderTop: '1px solid var(--borderNeutral5)' }"
            pt="spacing-m"
          >
            <button
              type="button"
              :class="buttonClassName"
              data-variant="secondary"
              data-size="md"
              data-has-label="true"
            >
              <span :class="buttonLabelClassName" data-empty="false">Cancel</span>
            </button>
            <button
              type="button"
              :class="buttonClassName"
              data-variant="primary"
              data-size="md"
              data-has-label="true"
            >
              <span :class="buttonLabelClassName" data-empty="false">Primary Action</span>
            </button>
          </FivraBoxPreview>
        </FivraBoxPreview>
      </FivraBoxPreview>
    `,
    setup() {
      return {
        buttonClassName: BUTTON_CLASS_NAME,
        buttonIconClassName: BUTTON_ICON_CLASS,
        buttonLabelClassName: BUTTON_LABEL_CLASS,
      };
    },
  }),
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: NESTED_COMPOSITION_SOURCE,
      },
      description: {
        story:
          'Nested composition highlights how `Box` can wrap interactive elements, grids, and flex rows while preserving author-supplied styles.',
      },
    },
  },
};
