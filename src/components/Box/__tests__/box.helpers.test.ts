import { describe, expect, it } from 'vitest';

import { createBoxStyles } from '../box.helpers';

describe('createBoxStyles', () => {
  it('applies spacing shorthands with side precedence', () => {
    const style = createBoxStyles({
      p: 'spacing-m',
      px: 'spacing-s',
      pl: 'spacing-l',
    });

    expect(style.paddingTop).toBe('calc(var(--spacing-m) * 1px)');
    expect(style.paddingBottom).toBe('calc(var(--spacing-m) * 1px)');
    expect(style.paddingRight).toBe('calc(var(--spacing-s) * 1px)');
    expect(style.paddingLeft).toBe('calc(var(--spacing-l) * 1px)');
  });

  it('resolves design tokens for colors, radius, and border width', () => {
    const style = createBoxStyles({
      backgroundColor: 'background-neutral-0',
      borderColor: 'border-primary-interactive',
      borderRadius: 'radius-m',
      borderWidth: 'border-width-s',
    });

    expect(style.backgroundColor).toBe('var(--background-neutral-0)');
    expect(style.borderColor).toBe('var(--border-primary-interactive)');
    expect(style.borderRadius).toBe('calc(var(--radius-m) * 1px)');
    expect(style.borderWidth).toBe('calc(var(--borderwidth-s) * 1px)');
  });

  it('resolves shadow presets and dimensions', () => {
    const style = createBoxStyles({
      boxShadow: 'shadow-m',
      width: 'spacing-xl',
      height: 32,
    });

    expect(style.boxShadow).toBe(
      'calc(var(--shadows-mx) * 1px) calc(var(--shadows-my) * 1px) calc(var(--shadows-m-blur) * 1px) calc(var(--shadows-m-spread) * 1px) var(--shadows-m-color)',
    );
    expect(style.width).toBe('calc(var(--spacing-xl) * 1px)');
    expect(style.height).toBe('32px');
  });
});
