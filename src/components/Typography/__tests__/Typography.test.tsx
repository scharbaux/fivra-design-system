import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Typography } from '@components/Typography';
import { DEFAULT_TYPOGRAPHY_VARIANT, ensureTypographyStyles } from '../typography.styles';

describe('Typography', () => {
  it('renders body text as a paragraph by default', () => {
    render(<Typography>Readable copy</Typography>);

    const paragraph = screen.getByText('Readable copy');

    expect(paragraph.tagName).toBe('P');
    expect(paragraph).toHaveAttribute('data-variant', DEFAULT_TYPOGRAPHY_VARIANT);
    expect(paragraph).not.toHaveAttribute('data-truncate');
  });

  it('selects semantic elements for heading variants', () => {
    render(
      <>
        <Typography variant="heading-1">Heading One</Typography>
        <Typography variant="heading-2">Heading Two</Typography>
        <Typography variant="heading-3">Heading Three</Typography>
      </>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('data-variant', 'heading-1');
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('data-variant', 'heading-2');
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute('data-variant', 'heading-3');
  });

  it('accepts an `as` override without losing variant metadata', () => {
    render(
      <Typography variant="heading-2" as="p">
        Custom element
      </Typography>,
    );

    const element = screen.getByText('Custom element');

    expect(element.tagName).toBe('P');
    expect(element).toHaveAttribute('data-variant', 'heading-2');
  });

  it('supports truncate and noWrap attributes', () => {
    render(
      <Typography truncate noWrap>
        Overflow content
      </Typography>,
    );

    const element = screen.getByText('Overflow content');

    expect(element).toHaveAttribute('data-truncate', 'true');
    expect(element).toHaveAttribute('data-nowrap', 'true');
  });

  it('only injects styles into the document once', async () => {
    render(
      <>
        <Typography>First</Typography>
        <Typography>Second</Typography>
      </>,
    );

    await waitFor(() => {
      const styles = document.querySelectorAll('style[data-fivra-typography-styles="true"]');
      expect(styles).toHaveLength(1);
    });

    ensureTypographyStyles();

    const styles = document.querySelectorAll('style[data-fivra-typography-styles="true"]');
    expect(styles).toHaveLength(1);
  });
});
