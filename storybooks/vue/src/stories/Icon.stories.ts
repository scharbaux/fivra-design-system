import type { Meta, StoryObj } from '@storybook/vue3';

import { icons as ICONS } from '@shared/icons/icons.generated';

import { FivraBoxPreview } from './Box.preview';
import { FivraIconPreview, type VueIconProps } from './Icon.preview';

const iconNames = Object.keys(ICONS).sort();
const defaultIcon = iconNames.includes('chevron-right')
  ? 'chevron-right'
  : iconNames[0] ?? '';
const SIZES_TEMPLATE = `
  <FivraBoxPreview display="flex" gap="spacing-l" alignItems="center">
    <FivraIconPreview name="${defaultIcon}" variant="outline" color="text-secondary-interactive" size="s" />
    <FivraIconPreview name="${defaultIcon}" variant="outline" color="text-secondary-interactive" size="m" />
    <FivraIconPreview name="${defaultIcon}" variant="outline" color="text-secondary-interactive" size="xl-2" />
    <FivraIconPreview name="${defaultIcon}" variant="outline" color="text-secondary-interactive" size="xl-3" />
  </FivraBoxPreview>
`;
const COLORS_TEMPLATE = `
  <FivraBoxPreview display="flex" gap="spacing-l">
    <FivraIconPreview name="${defaultIcon}" variant="solid" size="xl-2" color="text-primary-interactive" />
    <FivraIconPreview name="${defaultIcon}" variant="solid" size="xl-2" color="text-primary-success" />
    <FivraIconPreview name="${defaultIcon}" variant="solid" size="xl-2" color="text-primary-warning" />
    <FivraIconPreview name="${defaultIcon}" variant="solid" size="xl-2" color="text-primary-error" />
  </FivraBoxPreview>
`;

type VueIconStoryArgs = VueIconProps;

const meta: Meta<VueIconStoryArgs> = {
  title: 'Atomics/Icon',
  id: 'atomics-icon-vue',
  component: FivraIconPreview,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
      description: 'Icon identifier from the generated map (src/shared/icons/icons.generated.ts).',
      table: { category: 'Identity' },
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['outline', 'solid'],
      description: 'Choose the icon style. Outline and Solid are separate assets.',
      table: { category: 'Identity' },
    },
    size: {
      control: 'text',
      description:
        "Token key (e.g. 'xl-2' -> '--iconsizes-xl-2'), number in px (e.g. 24), or any CSS size. Defaults to 'm'.",
      table: { category: 'Sizing' },
    },
    color: {
      control: 'text',
      description:
        "Token key (e.g. 'text-primary-interactive' -> '--text-primary-interactive') or any CSS color value. Applies to fill via currentColor.",
      table: { category: 'Color' },
    },
    title: {
      control: 'text',
      description: "Optional tooltip text (native 'title' attribute). Not a replacement for aria-label.",
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: "Accessible name announced by screen readers; switches role to 'img' and unsets aria-hidden.",
      table: { category: 'Accessibility' },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Zt40QOhEylVnVmHOfrbex8/Figma-Icons-Exporter--demo-file-?node-id=0-1&t=LCoE4lsUxsvxZNg7-1',
    },
    docs: {
      source: {
        type: 'dynamic',
      },
      description: {
        component:
          'Renders icons by name and style from the generated map. Props are grouped below: Identity (name, variant), Sizing (size), Color (color), Accessibility (title, aria-label).',
      },
    },
  },
  render: (args) => ({
    components: { FivraIconPreview },
    setup() {
      return { args };
    },
    template: '<FivraIconPreview v-bind="args" />',
  }),
};

export default meta;

type Story = StoryObj<VueIconStoryArgs>;

export const Basic: Story = {
  name: 'Outline',
  args: {
    name: defaultIcon,
    variant: 'outline',
    size: 'xl-2',
    color: 'text-primary-interactive',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Outline variant scaled with the `xl-2` icon-size token and tinted with the `text-primary-interactive` text token.',
      },
    },
  },
};

export const Solid: Story = {
  args: {
    ...(Basic.args ?? {}),
    variant: 'solid',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Solid style uses filled shapes only. It shares the same API as the outline variant.',
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    name: defaultIcon,
    variant: 'outline',
    color: 'text-secondary-interactive',
  },
  render: () => ({
    components: { FivraBoxPreview, FivraIconPreview },
    template: SIZES_TEMPLATE,
  }),
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: SIZES_TEMPLATE.trim(),
      },
      description: {
        story:
          'Highlights the icon size scale using token keys (`s`, `m`, `xl-2`, `xl-3`). The component defaults to `m`.',
      },
    },
  },
};

export const Colors: Story = {
  args: {
    name: defaultIcon,
    variant: 'solid',
    size: 'xl-2',
  },
  render: () => ({
    components: { FivraBoxPreview, FivraIconPreview },
    template: COLORS_TEMPLATE,
  }),
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: COLORS_TEMPLATE.trim(),
      },
      description: {
        story:
          "Icons inherit 'currentColor'. Token keys like `text-primary-success` or `text-primary-error` map to theme CSS variables.",
      },
    },
  },
};

export const WithTitle: Story = {
  args: {
    name: defaultIcon,
    title: 'Descriptive title for tooltip',
    variant: 'outline',
    size: 'xl-2',
  },
  parameters: {
    docs: {
      description: {
        story:
          "Adds a native browser tooltip via the 'title' attribute. For accessibility, prefer 'aria-label' to convey meaning.",
      },
    },
  },
};

export const WithAriaLabel: Story = {
  args: {
    name: defaultIcon,
    variant: 'solid',
    size: 'xl-2',
    color: 'text-neutral-1',
    'aria-label': 'Notifications',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sets an accessible name that screen readers announce and toggles role to \'img\'. Use concise, meaningful labels.',
      },
    },
  },
};
