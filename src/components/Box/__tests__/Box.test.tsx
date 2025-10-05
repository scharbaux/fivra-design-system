import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Box } from '@components/Box';
import { BOX_CLASS_NAME, BOX_STYLE_ATTRIBUTE, ensureBoxStyles } from '../box.styles';

describe('Box', () => {
  it('renders a div by default and forwards children', () => {
    render(
      <Box data-testid="layout-box">
        <span>Content</span>
      </Box>,
    );

    const element = screen.getByTestId('layout-box');
    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains(BOX_CLASS_NAME)).toBe(true);
    expect(element).toHaveTextContent('Content');
  });

  it('respects polymorphic `as` overrides', () => {
    render(
      <Box as="section" data-testid="section-box">
        Section content
      </Box>,
    );

    const element = screen.getByTestId('section-box');
    expect(element.tagName).toBe('SECTION');
  });

  it('applies spacing shorthands with side precedence', () => {
    render(
      <Box
        data-testid="spacing-box"
        p="spacing-m"
        px="spacing-s"
        pl="spacing-l"
      />,
    );

    const element = screen.getByTestId('spacing-box');
    const { cssText } = element.style;
    expect(cssText).toContain('padding-top: calc(var(--spacingM) * 1px)');
    expect(cssText).toContain('padding-bottom: calc(var(--spacingM) * 1px)');
    expect(cssText).toContain('padding-right: calc(var(--spacingS) * 1px)');
    expect(cssText).toContain('padding-left: calc(var(--spacingL) * 1px)');
  });

  it('converts token props to CSS custom property references', () => {
    render(
      <Box
        data-testid="token-box"
        backgroundColor="background-neutral-0"
        borderRadius="radius-m"
      />,
    );

    const element = screen.getByTestId('token-box');
    expect(element.style.backgroundColor).toBe('var(--backgroundNeutral0)');
    expect(element.style.borderRadius).toBe('calc(var(--radiusM) * 1px)');
  });

  it('wires display and flexbox helpers', () => {
    render(
      <Box
        data-testid="flex-box"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        gap="spacing-m"
      />,
    );

    const element = screen.getByTestId('flex-box');
    expect(element.style.display).toBe('flex');
    expect(element.style.flexDirection).toBe('column');
    expect(element.style.justifyContent).toBe('center');
    expect(element.style.alignItems).toBe('flex-start');
    expect(element.style.gap).toBe('calc(var(--spacingM) * 1px)');
  });

  it('only injects styles into the document once', async () => {
    render(
      <>
        <Box data-testid="first-box" />
        <Box data-testid="second-box" />
      </>,
    );

    await waitFor(() => {
      const styles = document.querySelectorAll(`style[${BOX_STYLE_ATTRIBUTE}="true"]`);
      expect(styles).toHaveLength(1);
    });

    ensureBoxStyles();

    const styles = document.querySelectorAll(`style[${BOX_STYLE_ATTRIBUTE}="true"]`);
    expect(styles).toHaveLength(1);
  });
});
