import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { defineFivraButton } from "@web-components";

const meta: Meta<typeof Button> = {
  title: "Components/Button/React",
  component: Button,
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
      options: ["primary", "secondary", "ghost"],
      description: "Visual treatment of the button.",
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
  },
  parameters: {
    docs: {
      description: {
        component:
          "Accessible button primitive with primary, secondary, and ghost variants. Supports icons, full-width layout, and forwards native button attributes.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "Primary button emphasizes the main action with solid background and white text.",
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
        story: "Secondary button uses an outlined style appropriate for tertiary actions.",
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
  parameters: {
    docs: {
      description: {
        story: "Ghost buttons sit on neutral backgrounds and rely on text color for emphasis.",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    children: "Download",
    leadingIcon: <Icon name="chevron-right" variant="solid" aria-hidden="true" />,
    trailingIcon: <Icon name="chevron-right" variant="outline" aria-hidden="true" />,
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
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Small, medium, and large presets adjust padding, font size, and icon spacing.",
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
  render: (args) => (
    <div style={{ width: 320 }}>
      <Button {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Full-width mode is useful for responsive layouts or stacked mobile actions.",
      },
    },
  },
};

const WebComponentPreview: React.FC = () => {
  React.useEffect(() => {
    defineFivraButton();
  }, []);

  return (
    <fivra-button variant="secondary" size="md">
      <span slot="leading-icon" aria-hidden="true">
        ★
      </span>
      Web component
    </fivra-button>
  );
};

export const WebComponent: Story = {
  name: "Web Component",
  render: () => <WebComponentPreview />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Custom element preview. Call `defineFivraButton()` before first render to register `<fivra-button>`.",
      },
    },
  },
};

declare global {
  // Allow JSX usage of the custom element in stories without tsconfig tweaks.
  namespace JSX {
    interface IntrinsicElements {
      'fivra-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'full-width'?: boolean;
        variant?: string;
        size?: string;
        type?: string;
      };
    }
  }
}
