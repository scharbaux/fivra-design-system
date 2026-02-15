import { describe, expect, it } from 'vitest';

import { createBoxStyles } from '../box.helpers';

describe('createBoxStyles', () => {
  it('applies spacing shorthands with side precedence', () => {
    const style = createBoxStyles({
      p: 'spacing-m',
      px: 'spacing-s',
      pl: 'spacing-l',
    });

    expect(style.paddingTop).toBe('calc(var(--spacingM) * 1px)');
    expect(style.paddingBottom).toBe('calc(var(--spacingM) * 1px)');
    expect(style.paddingRight).toBe('calc(var(--spacingS) * 1px)');
    expect(style.paddingLeft).toBe('calc(var(--spacingL) * 1px)');
  });

  it('resolves design tokens for colors, radius, and border width', () => {
    const style = createBoxStyles({
      backgroundColor: 'background-neutral-0',
      borderColor: 'border-primary-interactive',
      borderRadius: 'radius-m',
      borderWidth: 'border-width-s',
    });

    expect(style.backgroundColor).toBe('var(--backgroundNeutral0)');
    expect(style.borderColor).toBe('var(--borderPrimaryInteractive)');
    expect(style.borderRadius).toBe('calc(var(--radiusM) * 1px)');
    expect(style.borderWidth).toBe('calc(var(--borderwidthS) * 1px)');
  });

  it('resolves shadow presets and dimensions', () => {
    const style = createBoxStyles({
      boxShadow: 'shadow-m',
      width: 'spacing-xl',
      height: 32,
    });

    expect(style.boxShadow).toBe(
      'calc(var(--shadowsMX) * 1px) calc(var(--shadowsMY) * 1px) calc(var(--shadowsMBlur) * 1px) calc(var(--shadowsMSpread) * 1px) var(--shadowsMColor)',
    );
    expect(style.width).toBe('calc(var(--spacingXl) * 1px)');
    expect(style.height).toBe('32px');
  });
});
