import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from '@components';

const ICONS_MAP = {
  example: 'M4 4h16v16H4z',
};

describe('Icon', () => {
  it('applies numeric sizes via width and height attributes', () => {
    const { getByLabelText } = render(
      <Icon
        name="example"
        icons={ICONS_MAP}
        size={32}
        aria-label="Numeric sized icon"
      />,
    );

    const svg = getByLabelText('Numeric sized icon');

    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('width')).toBe('32px');
    expect(svg.getAttribute('height')).toBe('32px');
    expect(svg.getAttribute('style')).toBeNull();
  });

  it('merges token-driven size into inline styles when size is a CSS variable', () => {
    const tokenSize = 'var(--iconsizes-xl-2)';
    const { getByLabelText } = render(
      <Icon
        name="example"
        icons={ICONS_MAP}
        size={tokenSize}
        aria-label="Token sized icon"
      />,
    );

    const svg = getByLabelText('Token sized icon');

    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('width')).toBeNull();
    expect(svg.getAttribute('height')).toBeNull();
    expect(svg).toHaveStyle({ width: tokenSize, height: tokenSize });
  });

  it('resolves token keys for size and color props', () => {
    const { getByLabelText } = render(
      <Icon
        name="example"
        icons={ICONS_MAP}
        size="xl-2"
        color="text-primary-interactive"
        aria-label="Token key icon"
      />,
    );

    const svg = getByLabelText('Token key icon');

    expect(svg.getAttribute('width')).toBeNull();
    expect(svg.getAttribute('height')).toBeNull();
    expect(svg).toHaveStyle({ width: 'var(--iconsizes-xl-2)', height: 'var(--iconsizes-xl-2)' });
    expect(svg.getAttribute('color')).toBe('var(--text-primary-interactive)');
  });
});
