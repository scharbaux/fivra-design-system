import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box } from "@components/Box";
import { Button } from "@components/Button";
import { icons as ICONS } from "@shared/icons/icons.generated";
import {
  backgroundColorTokenOptions,
  borderColorTokenOptions,
  textColorTokenOptions,
} from "@styles/themes/storybook-token-options.generated";
import { defineFivraButton } from "@web-components";

const iconNames = Object.keys(ICONS).sort();

const DEFAULT_OPTION = "(default)";
const SURFACE_COLOR_OPTIONS = [DEFAULT_OPTION, ...backgroundColorTokenOptions] as const;
const BORDER_COLOR_OPTIONS = [DEFAULT_OPTION, ...borderColorTokenOptions] as const;
const TEXT_COLOR_OPTIONS = [DEFAULT_OPTION, ...textColorTokenOptions] as const;

const ICON_NAME_OPTIONS = ["(none)", ...iconNames] as const;

const meta: Meta<typeof Button> = {
  title: "Atomics/Button",
  id: "atomics-button-react",
  component: Button,
  tags: ["autodocs"],
  args: {
    label: "Button",
    variant: "primary",
  },
  argTypes: {
    onClick: { action: "clicked" },
    children: {
      control: false,
      description: "Advanced: provide custom children. Prefer `label` for simple usage.",
      table: { category: "Content" },
    },
    label: {
      control: "text",
      description: "Visible label text for the button.",
      table: { category: "Content" },
    },
    color: {
      control: "inline-radio",
      options: ["(default)", "primary-success", "primary-warning", "primary-error"],
      mapping: {
        "(default)": undefined,
      },
      description: "Preset palette identifier. Initially supports success/warning/error.",
      table: { category: "Appearance" },
    },
    surfaceColor: {
      control: "select",
      options: SURFACE_COLOR_OPTIONS,
      mapping: {
        "(default)": undefined,
      },
      description: "Overrides the surface color via a design token string (e.g., `background-primary-success`).",
      table: { category: "Appearance" },
    },
    borderColor: {
      control: "select",
      options: BORDER_COLOR_OPTIONS,
      mapping: {
        "(default)": undefined,
      },
      description: "Overrides the border color via a design token string (e.g., `border-primary-success`).",
      table: { category: "Appearance" },
    },
    textColor: {
      control: "select",
      options: TEXT_COLOR_OPTIONS,
      mapping: {
        "(default)": undefined,
      },
      description: "Overrides the text color via a design token string (e.g., `text-primary-success`).",
      table: { category: "Appearance" },
    },
    accentColor: {
      control: "text",
      description: "Overrides the accent color driving state layers via a design token string.",
      table: { category: "Appearance" },
    },
    leadingIcon: {
      control: false,
      description: "Optional icon rendered before the label.",
    },
    leadingIconName: {
      control: "select",
      options: ICON_NAME_OPTIONS,
      mapping: {
        "(none)": undefined,
      },
      description: "Icon name rendered before the label using the shared Icon component.",
      table: { category: "Appearance" },
    },
    trailingIcon: {
      control: false,
      description: "Optional icon rendered after the label.",
    },
    trailingIconName: {
      control: "select",
      options: ICON_NAME_OPTIONS,
      mapping: {
        "(none)": undefined,
      },
      description: "Icon name rendered after the label using the shared Icon component.",
      table: { category: "Appearance" },
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
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: "Primary",
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
    label: "Secondary",
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
    label: "Tertiary",
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
  decorators: [
    (Story) => (
      <Box display="flex" gap="spacing-l" alignItems="center" flexWrap="wrap">
        <Story />
      </Box>
    ),
  ],
  render: () => (
    <>
      <Button variant="primary" disabled label="Primary" />
      <Button variant="secondary" disabled label="Secondary" />
      <Button variant="tertiary" disabled label="Tertiary" />
    </>
  ),
  parameters: {
    docs: {
      source: { type: "dynamic" },
      description: {
        story:
          "Disabled states pull from `--backgroundPrimaryDisabled`, `--backgroundSecondaryDisabled`, and `--textPrimaryDisabled` ensuring consistent contrast and borders via `--borderPrimaryDisabled`.",
      },
    },
  },
};

export const SemanticOverrides: Story = {
  name: "Semantic Overrides",
  decorators: [
    (Story) => (
      <Box display="grid" gap="spacing-l" style={{ gridTemplateColumns: "repeat(3, max-content)" }}>
        <Story />
      </Box>
    ),
  ],
  render: () => (
    <>
      <Button variant="primary" color="primary-success" label="Success Primary" />
      <Button variant="primary" color="primary-warning" label="Warning Primary" />
      <Button variant="primary" color="primary-error" label="Error Primary" />

      <Button variant="secondary" color="primary-success" label="Success Secondary" />
      <Button variant="secondary" color="primary-warning" label="Warning Secondary" />
      <Button variant="secondary" color="primary-error" label="Error Secondary" />

      <Button variant="tertiary" color="primary-success" label="Success Tertiary" />
      <Button variant="tertiary" color="primary-warning" label="Warning Tertiary" />
      <Button variant="tertiary" color="primary-error" label="Error Tertiary" />
    </>
  ),
  parameters: {
    docs: {
      source: { type: "dynamic" },
      description: {
        story:
          "Set `color` to apply semantic palettes while the per-variant color-mix state layers adapt automatically. For full control, use `surfaceColor`, `borderColor`, `textColor`, and `accentColor` to point at specific theme tokens.",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    label: "Download",
    leadingIconName: "chevron-left",
    trailingIconName: "chevron-right",
  },
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Button
  variant="primary"
  leadingIconName="chevron-left"
  trailingIconName="chevron-right"
  label="Download"
/>`,
      },
      description: {
        story:
          "Demonstrates leading and trailing icon slots. Use `leadingIconName`/`trailingIconName` for the common case, or `leadingIcon`/`trailingIcon` for full control.",
      },
    },
  },
};

export const Sizes: Story = {
  decorators: [
    (Story) => (
      <Box display="flex" gap="spacing-l" alignItems="center" flexWrap="wrap">
        <Story />
      </Box>
    ),
  ],
  render: () => (
    <>
      <Button variant="primary" size="sm" label="Small" />
      <Button variant="primary" size="md" label="Medium" />
      <Button variant="primary" size="lg" label="Large" />
    </>
  ),
  parameters: {
    docs: {
      source: { type: "dynamic" },
      description: {
        story:
          "Small, medium, and large presets use explicit padding (12×4, 16×8, 24×12) with heights 24/32/40px and radii mapped to `--radiusXs`, `--radiusS`, and `--radiusM`.",
      },
    },
  },
};

export const FullWidth: Story = {
  decorators: [
    (Story) => (
      <Box width={320}>
        <Story />
      </Box>
    ),
  ],
  render: () => <Button label="Continue" fullWidth variant="primary" />,
  parameters: {
    docs: {
      source: { type: "dynamic" },
      description: {
        story: "Full-width mode is useful for responsive layouts or stacked mobile actions.",
      },
    },
  },
};

export const Dropdown: Story = {
  args: {
    label: "Menu",
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
    label: "Saving...",
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
    label: '',
    iconOnly: true,
    'aria-label': 'Next',
    variant: 'tertiary',
    leadingIconName: "chevron-right",
  },
  render: (args) => <Button {...args} />,
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Button
  iconOnly
  aria-label="Next"
  variant="tertiary"
  leadingIconName="chevron-right"
/>`,
      },
      description: {
        story:
          "Icon-only buttons collapse to a circular hit area via `--radiusMax`. Remember to supply an accessible `aria-label`.",
      },
    },
  },
};

const WebComponentPreview: React.FC = () => {
  React.useEffect(() => {
    if (!customElements.get("fivra-button")) {
      defineFivraButton();
    }
  }, []);

  return (
    <fivra-button variant="secondary" size="md" dropdown>
      <span slot="leading-icon" aria-hidden="true">
        😺
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
        color?: string;
        label?: string;
        'surface-color'?: string;
        'border-color'?: string;
        'text-color'?: string;
        'accent-color'?: string;
        size?: string;
        type?: string;
        dropdown?: boolean;
      };
    }
  }
}
