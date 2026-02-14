import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button, BUTTON_ICON_CLASS } from '@components/Button';
import {
  COLOR_MIX_SUPPORTS_DECLARATION,
  ensureButtonStyles,
} from '@shared/button/button.styles';

describe('Button', () => {
  it('renders the provided label and defaults to type="button"', () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole('button', { name: 'Save changes' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).not.toHaveAttribute('data-full-width');
  });

  it('renders label prop when children are not provided', () => {
    render(<Button label="Save changes" />);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('supports variant, size, and fullWidth props', () => {
    render(
      <Button variant="tertiary" size="lg" fullWidth>
        Explore
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Explore' });

    expect(button).toHaveAttribute('data-variant', 'tertiary');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveAttribute('data-full-width', 'true');
  });

  it('renders leading and trailing icons with aria-hidden wrappers', () => {
    render(
      <Button
        leadingIcon={<span data-testid="leading-icon" />}
        trailingIcon={<span data-testid="trailing-icon" />}
      >
        Download
      </Button>,
    );

    const wrappers = screen
      .getAllByTestId(/icon$/i)
      .map((icon) => icon.parentElement as HTMLElement | null);

    wrappers.forEach((wrapper) => {
      expect(wrapper).toBeInstanceOf(HTMLElement);
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      expect((wrapper as HTMLElement).className).toContain(BUTTON_ICON_CLASS);
    });
  });

  it('renders shared icons when leadingIconName/trailingIconName are provided', () => {
    const { container } = render(
      <Button leadingIconName="chevron-left" trailingIconName="chevron-right">
        Download
      </Button>,
    );

    expect(container.querySelector(`.${BUTTON_ICON_CLASS} svg`)).toBeTruthy();
  });

  it('applies semantic color aliases without requiring inline style props', () => {
    render(<Button variant="secondary" color="primary-success" label="Continue" />);

    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button.style.getPropertyValue('--fivra-button-accent')).toBe('var(--textPrimarySuccess)');
    expect(button.style.getPropertyValue('--fivra-button-border')).toBe('var(--borderPrimarySuccess)');
  });

  it('applies semantic color aliases without requiring inline style props', () => {
    render(<Button variant="secondary" color="primary-success" label="Continue" />);

    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button.style.getPropertyValue('--fivra-button-accent')).toBe('var(--textPrimarySuccess)');
    expect(button.style.getPropertyValue('--fivra-button-border')).toBe('var(--borderPrimarySuccess)');
  });

  it('forwards click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports iconOnly, dropdown, and loading props', () => {
    render(
      <Button
        iconOnly
        dropdown
        loading
        aria-label="Open menu"
        leadingIcon={<span data-testid="menu-icon" />}
      />,
    );

    const button = screen.getByRole('button', { name: 'Open menu' });

    expect(button).toHaveAttribute('data-icon-only', 'true');
    expect(button).toHaveAttribute('data-has-label', 'false');
    expect(button).toHaveAttribute('data-dropdown', 'true');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button.querySelector('.fivra-button__spinner')).toBeInTheDocument();
  });

  it('derives hasLabel from trimmed children unless overridden', () => {
    const { rerender } = render(<Button>{'   '}</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-has-label', 'false');

    rerender(
      <Button hasLabel>{'   '}</Button>,
    );

    expect(button).toHaveAttribute('data-has-label', 'true');
  });

  it('defaults aria-haspopup to "menu" for dropdown buttons and respects overrides', () => {
    const { rerender } = render(<Button dropdown>Menu</Button>);

    let button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).not.toHaveAttribute('aria-expanded');

    rerender(
      <Button dropdown aria-haspopup="listbox" aria-expanded="true">
        Menu
      </Button>,
    );

    button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'true');

    rerender(
      <Button dropdown aria-expanded="false">
        Menu
      </Button>,
    );

    button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('injects brand-focused overlay mixes for primary variants', () => {
    ensureButtonStyles();

    const style = document.querySelector<HTMLStyleElement>(
      'style[data-fivra-button-styles="true"]',
    );

    expect(style).toBeInstanceOf(HTMLStyleElement);
    const textContent = style?.textContent ?? '';

    expect(textContent).toContain(COLOR_MIX_SUPPORTS_DECLARATION);
    expect(textContent).toContain(
      "--fivra-button-state-tint: var(--fivra-button-surface);",
    );
    expect(textContent).toContain(
      "--fivra-button-focus-accent: var(--backgroundPrimaryInteractive);",
    );
    expect(textContent).toContain(
      "--fivra-button-hover-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandHoverPercent), var(--fivra-button-state-tint));",
    );
    expect(textContent).toContain(
      "--fivra-button-active-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandActivePercent), var(--fivra-button-state-tint));",
    );
    expect(textContent).toContain(
      "--fivra-button-focus-ring-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandFocusPercent), var(--fivra-button-focus-accent));",
    );
    expect(textContent).toContain(
      "--fivra-button-hover-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-state-tint) var(--intensityBrandHoverPercent));",
    );
    expect(textContent).toContain(
      "--fivra-button-active-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-state-tint) var(--intensityBrandActivePercent));",
    );
    expect(textContent).toContain(
      "--fivra-button-focus-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-focus-accent) var(--intensityBrandFocusPercent));",
    );
  });

  it('keeps state-layer mixes centralized with variant-aware tint sources', () => {
    ensureButtonStyles();

    const style = document.querySelector<HTMLStyleElement>(
      'style[data-fivra-button-styles="true"]',
    );

    expect(style).toBeInstanceOf(HTMLStyleElement);
    const textContent = style?.textContent ?? '';

    expect(textContent).not.toContain(
      "--fivra-button-hover-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandHoverPercent));",
    );
    expect(textContent).not.toContain(
      "--fivra-button-focus-ring-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandFocusPercent));",
    );
    expect(textContent).toContain(
      ".fivra-button[data-variant='secondary'] {",
    );
    expect(textContent).toContain(
      "--fivra-button-state-tint: var(--fivra-button-border);",
    );
    expect(textContent).toContain(
      ".fivra-button[data-variant='tertiary'] {",
    );
    expect(textContent).toContain(
      "--fivra-button-state-tint: var(--fivra-button-text);",
    );
    expect(textContent).toContain(
      ".fivra-button[data-variant='secondary'],",
    );
    expect(textContent).toContain(
      "--fivra-button-hover-color: color-mix(in srgb, var(--fivra-button-state-tint) var(--intensityBrandHoverPercent), var(--stateLayerBrightenBase));",
    );
  });

});
