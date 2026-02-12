import { CommonModule } from "@angular/common";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { FivraButtonComponent, FivraButtonModule } from "@internal/angular/button";
import {
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from "@shared/button/button.styles";
import type { ButtonColor } from "@shared/button/color-overrides";
ensureButtonStyles();

const TONES = ["success", "warning", "error"] as const;

type ButtonStoryArgs = {
  label?: string;
  children?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
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
  ariaExpanded?: string | boolean | null;
  "aria-expanded"?: string;
  "aria-label"?: string;
  leadingIcon?: unknown;
  trailingIcon?: unknown;
  onClick?: (event: MouseEvent) => void;
};

type AngularStoryRenderResult = {
  moduleMetadata?: Record<string, unknown>;
  props?: Record<string, unknown>;
  styles?: string[];
  template?: string;
  component?: unknown;
};

const defaultRender = (args: ButtonStoryArgs) => {
  const {
    label,
    style,
    onClick,
    "aria-label": ariaLabelOverride,
    "aria-expanded": ariaExpandedOverride,
    ...rest
  } = args;
  const ariaLabel = ariaLabelOverride ?? rest.ariaLabel ?? null;
  const ariaExpanded = ariaExpandedOverride ?? rest.ariaExpanded ?? null;

  return {
    moduleMetadata: {
      imports: [CommonModule, FivraButtonModule],
    },
    props: {
      ...rest,
      style: style ?? null,
      label,
      ariaLabel,
      ariaExpanded,
      onClick,
    },
    template: `
      <fivra-button
        [label]="label"
        [variant]="variant"
        [color]="color"
        [size]="size"
        [fullWidth]="fullWidth"
        [iconOnly]="iconOnly"
        [hasLabel]="hasLabel"
        [dropdown]="dropdown"
        [loading]="loading"
        [type]="type"
        [disabled]="disabled"
        [ngStyle]="style"
        [ariaLabel]="ariaLabel"
        [ariaLabelledby]="ariaLabelledby"
        [ariaHaspopup]="ariaHaspopup"
        [ariaExpanded]="ariaExpanded"
        [attr.variant]="variant"
        [attr.color]="color ?? null"
        [attr.size]="size"
        [attr.full-width]="fullWidth ? '' : null"
        [attr.icon-only]="iconOnly ? '' : null"
        [attr.has-label]="hasLabel === null || hasLabel === undefined ? null : hasLabel ? 'true' : 'false'"
        [attr.dropdown]="dropdown ? '' : null"
        [attr.loading]="loading ? '' : null"
        [attr.type]="type ?? null"
        [attr.disabled]="disabled ? '' : null"
        [attr.aria-label]="ariaLabel"
        [attr.aria-labelledby]="ariaLabelledby"
        [attr.aria-haspopup]="ariaHaspopup ?? (dropdown ? 'menu' : null)"
        [attr.aria-expanded]="ariaExpanded"
        (click)="onClick?.($event)"
      ></fivra-button>
    `,
  };
};

const meta: Meta<ButtonStoryArgs> = {
  title: "Atomics/Button",
  id: "atomics-button-angular",
  component: FivraButtonComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FivraButtonModule],
    }),
  ],
  args: {
    label: "Button",
    variant: "primary",
  },
  argTypes: {
    onClick: { action: "clicked" },
    children: {
      control: false,
      description: "Advanced: provide projected content. Prefer `label` for straightforward usage.",
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

type Story = StoryObj<ButtonStoryArgs>;

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
  render: () =>
    withWebComponentLightDomShim({
      template: `
        <div
          style="
            display: flex;
            gap: calc(var(--spacingL) * 1px);
            align-items: center;
            flex-wrap: wrap;
          "
        >
          <fivra-button variant="primary" label="Primary" disabled></fivra-button>
          <fivra-button variant="secondary" label="Secondary" disabled></fivra-button>
          <fivra-button variant="tertiary" label="Tertiary" disabled></fivra-button>
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
  render: () =>
    withWebComponentLightDomShim({
      props: {
        tones: TONES,
      },
      template: `
        <div style="display: grid; gap: calc(var(--spacingM) * 1px);">
          <div
            style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;"
          >
            <fivra-button
              *ngFor="let tone of tones"
              variant="primary"
              [color]="'primary-' + tone"
              [label]="tone + ' Primary'"
            ></fivra-button>
          </div>
          <div
            style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;"
          >
            <fivra-button
              *ngFor="let tone of tones"
              variant="secondary"
              [color]="'primary-' + tone"
              [label]="tone + ' Secondary'"
            ></fivra-button>
          </div>
          <div
            style="display: flex; gap: calc(var(--spacingL) * 1px); flex-wrap: wrap;"
          >
            <fivra-button
              *ngFor="let tone of tones"
              variant="tertiary"
              [color]="'primary-' + tone"
              [label]="tone + ' Tertiary'"
            ></fivra-button>
          </div>
        </div>
      `,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Set `color` to apply semantic palettes while the per-variant color-mix state layers adapt automatically. Consumers can still override `--fivra-button-*` custom properties directly when needed.",
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    label: "Download",
  },
  render: (args) => {
    const { "aria-label": ariaLabelOverride, ariaLabel, ...rest } = args;
    const resolvedAriaLabel = ariaLabelOverride ?? ariaLabel ?? null;

    return withWebComponentLightDomShim({
      props: {
        ...rest,
        ariaLabel: resolvedAriaLabel,
      },
      template: `
        <ng-template #leadingIconTemplate>
          <span aria-hidden="true">⬇</span>
        </ng-template>
        <ng-template #trailingIconTemplate>
          <span aria-hidden="true">→</span>
        </ng-template>
        <fivra-button
          [label]="label"
          [variant]="variant"
          [size]="size"
          [fullWidth]="fullWidth"
          [iconOnly]="iconOnly"
          [dropdown]="dropdown"
          [loading]="loading"
          [type]="type"
          [disabled]="disabled"
          [ariaLabel]="ariaLabel"
          [ariaLabelledby]="ariaLabelledby"
          [leadingIcon]="leadingIconTemplate"
          [trailingIcon]="trailingIconTemplate"
          [attr.label]="label ?? null"
          [attr.variant]="variant"
          [attr.size]="size"
          [attr.full-width]="fullWidth ? '' : null"
          [attr.icon-only]="iconOnly ? '' : null"
          [attr.dropdown]="dropdown ? '' : null"
          [attr.loading]="loading ? '' : null"
          [attr.type]="type ?? null"
          [attr.disabled]="disabled ? '' : null"
          [attr.aria-label]="ariaLabel"
          [attr.aria-labelledby]="ariaLabelledby"
        ></fivra-button>
      `,
    });
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
    label: "Responsive",
    variant: "primary",
  },
  render: (args) => ({
    props: {
      ...args,
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
        <fivra-button [variant]="variant" size="sm" label="Small" [attr.variant]="variant" [attr.label]="'Small'"></fivra-button>
        <fivra-button [variant]="variant" size="md" label="Medium" [attr.variant]="variant" [attr.label]="'Medium'"></fivra-button>
        <fivra-button [variant]="variant" size="lg" label="Large" [attr.variant]="variant" [attr.label]="'Large'"></fivra-button>
      </div>
    `,
  }),
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
    label: "Continue",
    fullWidth: true,
    variant: "primary",
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <div style="width: 320px;">
        <fivra-button
          [label]="label"
          [variant]="variant"
          [size]="size"
          [fullWidth]="fullWidth"
          [attr.label]="label ?? null"
          [attr.variant]="variant"
          [attr.size]="size"
          [attr.full-width]="fullWidth ? '' : null"
        ></fivra-button>
      </div>
    `,
  }),
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
    iconOnly: true,
    children: undefined,
    "aria-label": "Next",
  },
  render: (args) => ({
    props: {
      ...args,
      ariaLabel: args["aria-label"] ?? args.ariaLabel ?? null,
    },
    template: `
      <ng-template #leadingIconTemplate>
        <span aria-hidden="true">→</span>
      </ng-template>
      <fivra-button
        [iconOnly]="iconOnly"
        [ariaLabel]="ariaLabel"
        [leadingIcon]="leadingIconTemplate"
        [attr.icon-only]="iconOnly ? '' : null"
        [attr.aria-label]="ariaLabel"
      ></fivra-button>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only buttons collapse to a circular hit area via `--radiusMax`. Remember to supply an accessible `aria-label`.",
      },
    },
  },
};
