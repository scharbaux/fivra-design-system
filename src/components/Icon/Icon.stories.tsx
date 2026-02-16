import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box } from "@components/Box";
import { Icon } from "@components";
import { icons as ICONS } from "@shared/icons/icons.generated";

const iconNames = Object.keys(ICONS).sort();
const defaultIcon = iconNames.includes("chevron-right")
  ? "chevron-right"
  : iconNames[0] ?? "";

const meta: Meta<typeof Icon> = {
  title: "Atomics/Icon",
  id: "atomics-icon-react",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
      description: "Icon identifier from the generated map (src/shared/icons/icons.generated.ts).",
      table: { category: "Identity" },
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["outline", "solid"],
      description: "Choose the icon style. Outline and Solid are separate assets.",
      table: { category: "Identity" },
    },
    size: {
      control: "text",
      description:
        "Token key (e.g. 'xl-2' -> '--iconsizes-xl-2'), number in px (e.g. 24), or any CSS size. Defaults to 'm'.",
      table: { category: "Sizing" },
    },
    color: {
      control: "text",
      description:
        "Token key (e.g. 'text-primary-interactive' -> '--text-primary-interactive') or any CSS color value. Applies to fill via currentColor.",
      table: { category: "Color" },
    },
    title: {
      control: "text",
      description: "Optional tooltip text (native 'title' attribute). Not a replacement for aria-label.",
      table: { category: "Accessibility" },
    },
    "aria-label": {
      control: "text",
      description: "Accessible name announced by screen readers; switches role to 'img' and unsets aria-hidden.",
      table: { category: "Accessibility" },
    },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Zt40QOhEylVnVmHOfrbex8/Figma-Icons-Exporter--demo-file-?node-id=0-1&t=LCoE4lsUxsvxZNg7-1",
    },
    docs: {
      source: {
        type: "dynamic",
      },
      description: {
        component:
          "Renders icons by name and style from the generated map. Props are grouped below: Identity (name, variant), Sizing (size), Color (color), Accessibility (title, aria-label).",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Basic: Story = {
  name: "Outline",
  args: {
    name: defaultIcon,
    variant: "outline",
    color: "text-primary-interactive",
    size: "xl-2",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Outline variant scaled with the `xl-2` icon-size token and tinted with the `text-primary-interactive` text token.",
      },
    },
  },
};

export const Solid: Story = {
  args: {
    ...(Basic.args as any),
    variant: "solid",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Solid style uses filled shapes only. It shares the same API as the outline variant.",
      },
    },
  },
};

export const Sizes: Story = {
  args: {
    name: defaultIcon,
    variant: "outline",
    color: "text-secondary-interactive",
  },
  render: (args) => (
    <Box display="flex" gap="spacing-l" alignItems="center">
      <Icon {...args} size="s" />
      <Icon {...args} size="m" />
      <Icon {...args} size="xl-2" />
      <Icon {...args} size="xl-3" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Highlights the icon size scale using token keys (`s`, `m`, `xl-2`, `xl-3`). The component defaults to `m`.",
      },
    },
  },
};

export const Colors: Story = {
  args: {
    name: defaultIcon,
    variant: "solid",
    size: "xl-2",
  },
  render: (args) => (
    <Box display="flex" gap="spacing-l">
      <Icon {...args} color="text-primary-interactive" />
      <Icon {...args} color="text-primary-success" />
      <Icon {...args} color="text-primary-warning" />
      <Icon {...args} color="text-primary-error" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icons inherit 'currentColor'. Token keys like `text-primary-success` or `text-primary-error` map to theme CSS variables.",
      },
    },
  },
};

// Stroke width control removed: outline thickness is baked in exported icons.

export const WithTitle: Story = {
  args: {
    name: defaultIcon,
    title: "Descriptive title for tooltip",
    variant: "outline",
    size: "xl-2",
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
    variant: "solid",
    size: "xl-2",
    color: "text-neutral-1",
    "aria-label": "Notifications",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Sets an accessible name that screen readers announce and toggles role to 'img'. Use concise, meaningful labels.",
      },
    },
  },
};
