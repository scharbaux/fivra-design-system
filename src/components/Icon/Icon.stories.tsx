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
        "Number in px (e.g. 24) or any CSS size (e.g. 'var(--iconsizes-l)'). Defaults to the token-driven 'var(--iconsizes-m)'.",
      table: { category: "Sizing" },
    },
    color: {
      control: "text",
      description:
        "Applies to fill via currentColor. Defaults to 'var(--text-secondary-interactive)' and can be overridden with props or parent color styles.",
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
    size: "var(--iconsizes-xl-2)",
    color: "var(--text-primary-interactive)",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Outline variant scaled via the token 'var(--iconsizes-xl-2)' and tinted with 'var(--text-primary-interactive)'.",
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
    color: "var(--text-secondary-interactive)",
  },
  render: (args) => (
    <Box display="flex" gap="spacing-l" alignItems="center">
      <Icon {...args} size="var(--iconsizes-s)" />
      <Icon {...args} size="var(--iconsizes-m)" />
      <Icon {...args} size="var(--iconsizes-xl-2)" />
      <Icon {...args} size="var(--iconsizes-xl-3)" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Highlights the icon size scale using the '--iconsizes*' tokens. The component defaults to 'var(--iconsizes-m)'.",
      },
    },
  },
};

export const TokenOverride: Story = {
  args: {
    name: defaultIcon,
    variant: "outline",
    color: "var(--text-primary-interactive)",
  },
  render: (args) => (
    <Box display="flex" flexDirection="column" gap="spacing-m">
      <Box
        display="flex"
        alignItems="center"
        gap="spacing-s"
        style={{ "--icon-size": "var(--iconsizes-l)" } as React.CSSProperties}
      >
        <span style={{ fontSize: "0.875rem" }}>Default token</span>
        <Icon {...args} size="var(--icon-size)" />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap="spacing-s"
        style={{ "--icon-size": "48px" } as React.CSSProperties}
      >
        <span style={{ fontSize: "0.875rem" }}>Overridden to 48px</span>
        <Icon {...args} size="var(--icon-size)" />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows how CSS custom properties can drive icon sizing. Each row reuses the same '--icon-size' token while the wrapper adjusts its value.",
      },
    },
  },
};

export const Colors: Story = {
  args: {
    name: defaultIcon,
    variant: "solid",
    size: "var(--iconsizes-xl-2)",
  },
  render: (args) => (
    <Box display="flex" gap="spacing-l">
      <Icon {...args} color="var(--text-primary-interactive)" />
      <Icon {...args} color="var(--text-primary-success)" />
      <Icon {...args} color="var(--text-primary-warning)" />
      <Icon {...args} color="var(--text-primary-error)" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icons inherit 'currentColor'. Token values like '--text-primary-success' or '--text-primary-error' make it easy to align with the theme palette.",
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
    size: "var(--iconsizes-xl-2)",
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
    size: "var(--iconsizes-xl-2)",
    color: "var(--text-neutral-1)",
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
