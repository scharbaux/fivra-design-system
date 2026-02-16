import { describe, expect, it } from 'vitest';

import {
  hasVariantKeys,
  isSvgMarkup,
  normalizeVariant,
  pickVariantEntry,
  resolveIconColor,
  resolveIconSize,
  toPx,
  type IconVariants,
} from '../icon.shared';

describe('icon.shared', () => {
  it('normalizes variant aliases', () => {
    expect(normalizeVariant('outline')).toBe('outline');
    expect(normalizeVariant('solid')).toBe('solid');
    expect(normalizeVariant('fill')).toBe('solid');
    expect(normalizeVariant('stroke')).toBe('outline');
    expect(normalizeVariant(undefined)).toBe('outline');
  });

  it('detects svg markup strings', () => {
    expect(isSvgMarkup('<svg viewBox="0 0 24 24"></svg>')).toBe(true);
    expect(isSvgMarkup('M4 4h16v16H4z')).toBe(false);
  });

  it('converts numeric values to px and preserves string values', () => {
    expect(toPx(24)).toBe('24px');
    expect(toPx('var(--iconsizes-m)')).toBe('var(--iconsizes-m)');
    expect(toPx(undefined)).toBeUndefined();
  });

  it('resolves token-based sizes and keeps explicit css sizes', () => {
    expect(resolveIconSize('xl-2')).toBe('var(--iconsizes-xl-2)');
    expect(resolveIconSize('iconsizes-l')).toBe('var(--iconsizes-l)');
    expect(resolveIconSize('--iconsizes-m')).toBe('var(--iconsizes-m)');
    expect(resolveIconSize('48px')).toBe('48px');
    expect(resolveIconSize('var(--icon-size)')).toBe('var(--icon-size)');
  });

  it('resolves token-based colors and keeps explicit css colors', () => {
    expect(resolveIconColor('text-primary-interactive')).toBe('var(--text-primary-interactive)');
    expect(resolveIconColor('--text-primary-success')).toBe('var(--text-primary-success)');
    expect(resolveIconColor('#111827')).toBe('#111827');
    expect(resolveIconColor('currentColor')).toBe('currentColor');
    expect(resolveIconColor('var(--text-primary-warning)')).toBe('var(--text-primary-warning)');
  });

  it('resolves icon variants with fallback order', () => {
    const entry: IconVariants<string> = {
      outline: 'outline-path',
      solid: 'solid-path',
    };

    expect(pickVariantEntry(entry, 'outline')).toBe('outline-path');
    expect(pickVariantEntry(entry, 'solid')).toBe('solid-path');
    expect(pickVariantEntry({ outline: 'outline-only' }, 'solid')).toBe('outline-only');
    expect(pickVariantEntry({ solid: 'solid-only' }, 'outline')).toBe('solid-only');
  });

  it('returns the original entry when candidate check is false', () => {
    const value = { foo: 'bar' };

    expect(pickVariantEntry(value, 'outline')).toEqual(value);
    expect(hasVariantKeys(value)).toBe(false);
    expect(hasVariantKeys({ outline: 'x' })).toBe(true);
  });
});
