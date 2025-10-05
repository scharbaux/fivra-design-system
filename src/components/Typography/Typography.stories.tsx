import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Typography } from '@components/Typography';
import { TYPOGRAPHY_VARIANTS } from './typography.styles';

const meta: Meta<typeof Typography> = {
  title: 'Atomics/Typography',
  id: 'atomics-typography-react',
  component: Typography,
  tags: ['autodocs'],
  args: {
    children: 'Fivra design tokens keep typography consistent across platforms.',
    variant: 'body-1',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: TYPOGRAPHY_VARIANTS,
      description:
        'Maps to Engage typography tokens (e.g., `--heading1FontSize`, `--body2LetterSpacing`).',
    },
    truncate: {
      control: 'boolean',
      description: 'Applies `text-overflow: ellipsis` and related data attributes for overflow handling.',
      table: { category: 'Layout' },
    },
    noWrap: {
      control: 'boolean',
      description: 'Prevents wrapping without applying overflow truncation styles.',
      table: { category: 'Layout' },
    },
    as: {
      control: false,
      description:
        'Override the rendered element. Headings default to semantic `<h1>`–`<h3>` tags while body text renders paragraphs.',
      table: { category: 'Accessibility' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Token-backed typography primitive that forwards native text attributes while aligning React adapters with future Angular and Vue implementations.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const BodyCopy: Story = {
  args: {
    children:
      'Use body variants for paragraphs, legal copy, and supporting descriptions. Engage tokens control font family, weight, and letter spacing.',
    variant: 'body-1',
  },
};

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'calc(var(--spacingM) * 1px)' }}>
      <Typography variant="heading-1">Heading 1</Typography>
      <Typography variant="heading-2">Heading 2</Typography>
      <Typography variant="heading-3">Heading 3</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Heading variants inherit semantic `<h1>`–`<h3>` elements by default so screen readers announce appropriate structure.',
      },
    },
  },
};

export const EmphasisAndLinks: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'calc(var(--spacingS) * 1px)' }}>
      <Typography variant="body-1-strong">Body 1 strong emphasizes supporting copy.</Typography>
      <Typography variant="body-2-strong">Body 2 strong with compact letter spacing.</Typography>
      <Typography variant="body-2-link" as="a" href="#">
        Body 2 link uses interactive tokens and can render as an anchor.
      </Typography>
      <Typography variant="caption-1">Caption 1 suits tertiary UI metadata.</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Typography variants remain token-sourced, enabling emphasis styles, link treatments, and captions without redefining CSS per framework.',
      },
    },
  },
};

export const Truncation: Story = {
  args: {
    truncate: true,
    children:
      'When truncate is enabled this sentence will end with an ellipsis once the layout constrains its width beyond a single line of readable space.',
    style: {
      maxWidth: '220px',
      display: 'block',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle `truncate` to add ellipsis overflow handling. Combine with `noWrap` to prevent soft line breaks when truncation is not necessary.',
      },
    },
  },
};

export const NoWrap: Story = {
  args: {
    noWrap: true,
    children: 'No wrap keeps inline copy on a single line without trimming the text.',
  },
};
