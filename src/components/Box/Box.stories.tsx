import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '@components/Box';
import { Typography } from '@components/Typography';
import { Button } from '@components/Button';
import { Icon } from '@components/Icon';

const meta: Meta<typeof Box> = {
  title: 'Atomics/Box',
  id: 'atomics-box-react',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    as: { control: false },
    display: {
      control: 'text',
      description: 'Sets the CSS display property for the rendered element.',
    },
    p: {
      control: 'text',
      description: 'Padding shorthand accepting Engage spacing tokens (e.g., `spacing-m`).',
      table: { category: 'Spacing' },
    },
    m: {
      control: 'text',
      description: 'Margin shorthand accepting Engage spacing tokens (e.g., `spacing-s`).',
      table: { category: 'Spacing' },
    },
    backgroundColor: {
      control: 'text',
      description: 'Background fill accepting Engage tokens like `background-neutral-0`.',
      table: { category: 'Appearance' },
    },
    borderRadius: {
      control: 'text',
      description: 'Corner radius token (e.g., `radius-m`).',
      table: { category: 'Appearance' },
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

type Story = StoryObj<typeof Box>;

export const PaddingAndMarginTokens: Story = {
  name: 'Padding & margin tokens',
  render: () => (
    <Box backgroundColor="background-neutral-6" p="spacing-xl" gap="spacing-m" display="grid">
      <Box backgroundColor="background-neutral-0" p="spacing-m" borderRadius="radius-m">
        Base padding applied via <code>p</code> with Engage spacing tokens.
      </Box>
      <Box
        backgroundColor="background-neutral-0"
        p="spacing-m"
        borderRadius="radius-m"
        mb="spacing-s"
      >
        Bottom margin tokens like <code>mb</code> space stacked content consistently.
      </Box>
      <Box backgroundColor="background-neutral-0" px="spacing-l" py="spacing-s" borderRadius="radius-m">
        Axis shorthands (`px`, `py`) cascade until side-specific overrides are provided.
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Spacing props map to Engage tokens such as `spacing-xl` or `spacing-s`, converting them to pixel values via CSS custom properties.',
      },
    },
  },
};

export const FlexAlignment: Story = {
  render: () => (
    <Box display="flex" gap="spacing-l" alignItems="center" justifyContent="space-between" p="spacing-m" backgroundColor="background-neutral-0" borderRadius="radius-l">
      <Box backgroundColor="background-neutral-6" p="spacing-s" borderRadius="radius-s">
        Start
      </Box>
      <Box display="flex" gap="spacing-s" alignItems="center">
        <Box backgroundColor="background-primary-interactive" color="background-neutral-0" p="spacing-xs" borderRadius="radius-xs" width="200px" display="flex" alignItems="flex-start">
          Flex child
        </Box>
        <Box backgroundColor="background-secondary-interactive" color="text-neutral-6" p="spacing-xs" borderRadius="radius-xs" width="200px" display="flex" justifyContent="center">
          Aligns center
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Flexbox helpers (`display`, `justifyContent`, `alignItems`, `gap`) provide quick wrappers for Storybook controls and layout scaffolding.',
      },
    },
  },
};

export const BackgroundUtilities: Story = {
  render: () => (
    <Box display="grid" gap="spacing-m" p="spacing-m" backgroundColor="background-neutral-6" borderRadius="radius-l">
      <Box backgroundColor="background-primary-interactive" color="text-neutral-6" p="spacing-m" borderRadius="radius-m">
        Primary background
      </Box>
      <Box backgroundColor="background-secondary-interactive" color="text-neutral-6" p="spacing-m" borderRadius="radius-m">
        Secondary background
      </Box>
      <Box backgroundColor="background-tertiary-interactive" color="text-neutral-1" p="spacing-m" borderRadius="radius-m">
        Tertiary background
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Background and text props accept Engage token strings, resolving them to `var(--tokenName)` references for consistent theme usage.',
      },
    },
  },
};

export const NestedComposition: Story = {
  render: () => (
    <Box display="grid" gap="spacing-l" p="spacing-l" backgroundColor="background-neutral-6" borderRadius="radius-l" justifyContent="center">
      <Box display="grid" gap="spacing-l" backgroundColor="background-neutral-0" borderRadius="radius-m" p="spacing-xl" width="400px">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body-1-strong">Card title</Typography>
          <Button
            aria-label="Close modal"
            iconOnly
            leadingIcon={<Icon aria-hidden="true" name="close" variant="outline" />}
            onClick={() => {}}
            variant="tertiary"
          >
            Button
          </Button>
        </Box>
        <Box color="text-neutral-2">
          <Typography variant="body-2-long">Reusable layout primitive enables nested shells without bespoke wrappers, ensuring consistent spacing and token usage.</Typography>
        </Box>
        <Box display="flex" gap="spacing-s" justifyContent="space-between" style={{borderTop: '1px solid var(--borderNeutral5)'}} pt="spacing-m">
          <Button variant="secondary">
            Cancel
          </Button>
          <Button variant="primary">
            Primary Action
          </Button>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Nested composition highlights how `Box` can wrap interactive elements, grids, and flex rows while preserving author-supplied styles.',
      },
    },
  },
};
