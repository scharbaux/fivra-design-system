import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { defineFivraButton, FivraButtonElement } from '@web-components';

const BRAND_HOVER_MIX =
  "--fivra-button-hover-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandHoverPercent), var(--fivra-button-accent));";
const BRAND_ACTIVE_MIX =
  "--fivra-button-active-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandActivePercent), var(--fivra-button-accent));";
const BRAND_FOCUS_MIX =
  "--fivra-button-focus-ring-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandFocusPercent), var(--fivra-button-accent));";
const BRAND_HOVER_HALO_MIX =
  "--fivra-button-hover-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandHoverPercent));";
const BRAND_ACTIVE_HALO_MIX =
  "--fivra-button-active-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandActivePercent));";
const BRAND_FOCUS_HALO_MIX =
  "--fivra-button-focus-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandFocusPercent));";
const ACCENT_HOVER_MIX =
  "--fivra-button-hover-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandHoverPercent));";
const ACCENT_ACTIVE_MIX =
  "--fivra-button-active-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandActivePercent));";
const ACCENT_FOCUS_MIX =
  "--fivra-button-focus-ring-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandFocusPercent));";

const queryShadowStyles = (element: FivraButtonElement): string => {
  return element.shadowRoot?.querySelector('style')?.textContent ?? '';
};

describe('FivraButtonElement styles', () => {
  beforeAll(() => {
    defineFivraButton();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes brand-centric overlay mixes for primary variants', () => {
    const element = document.createElement('fivra-button') as FivraButtonElement;
    document.body.appendChild(element);

    const styles = queryShadowStyles(element);

    expect(styles).toContain(BRAND_HOVER_MIX);
    expect(styles).toContain(BRAND_ACTIVE_MIX);
    expect(styles).toContain(BRAND_FOCUS_MIX);
    expect(styles).toContain(BRAND_HOVER_HALO_MIX);
    expect(styles).toContain(BRAND_ACTIVE_HALO_MIX);
    expect(styles).toContain(BRAND_FOCUS_HALO_MIX);
  });

  it('shifts neutral overlays to weight the accent color for outline tiers', () => {
    const element = document.createElement('fivra-button') as FivraButtonElement;
    document.body.appendChild(element);

    const styles = queryShadowStyles(element);

    expect(styles).toContain(".fivra-button[data-variant='secondary'] {");
    expect(styles).toContain(ACCENT_HOVER_MIX);
    expect(styles).toContain(ACCENT_ACTIVE_MIX);
    expect(styles).toContain(ACCENT_FOCUS_MIX);
    expect(styles).toContain(".fivra-button[data-variant='tertiary'] {");
  });

});

describe('FivraButtonElement behavior', () => {
  beforeAll(() => {
    defineFivraButton();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const waitForUpdates = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  it('syncs dropdown data attributes and aria fallbacks', async () => {
    const element = document.createElement('fivra-button') as FivraButtonElement;
    element.setAttribute('dropdown', '');
    element.textContent = 'Menu';
    document.body.appendChild(element);

    await waitForUpdates();

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.dataset.dropdown).toBe('true');
    expect(button?.getAttribute('aria-haspopup')).toBe('menu');
    expect(button?.getAttribute('aria-expanded')).toBeNull();

    element.setAttribute('aria-haspopup', 'listbox');
    element.setAttribute('aria-expanded', 'true');

    await waitForUpdates();

    expect(button?.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button?.getAttribute('aria-expanded')).toBe('true');

    element.removeAttribute('aria-haspopup');
    element.removeAttribute('aria-expanded');
    element.removeAttribute('dropdown');

    await waitForUpdates();

    expect(button?.dataset.dropdown).toBeUndefined();
    expect(button?.getAttribute('aria-haspopup')).toBeNull();
  });

  it('derives hasLabel from trimmed slot content with override support', async () => {
    const whitespaceElement = document.createElement('fivra-button') as FivraButtonElement;
    whitespaceElement.textContent = '   ';
    document.body.appendChild(whitespaceElement);

    await waitForUpdates();

    const whitespaceButton = whitespaceElement.shadowRoot?.querySelector('button');
    expect(whitespaceButton?.dataset.hasLabel).toBe('false');

    whitespaceElement.remove();

    const labelElement = document.createElement('fivra-button') as FivraButtonElement;
    labelElement.textContent = 'Submit';
    document.body.appendChild(labelElement);

    await waitForUpdates();

    const labelButton = labelElement.shadowRoot?.querySelector('button');
    expect(labelButton?.dataset.hasLabel).toBe('true');

    labelElement.setAttribute('has-label', 'false');
    await waitForUpdates();

    expect(labelButton?.dataset.hasLabel).toBe('false');
  });

  it('applies semantic color aliases via the color attribute', async () => {
    const element = document.createElement('fivra-button') as FivraButtonElement;
    element.setAttribute('variant', 'secondary');
    element.setAttribute('color', 'primary-success');
    element.textContent = 'Continue';
    document.body.appendChild(element);

    await waitForUpdates();

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(button?.style.getPropertyValue('--fivra-button-accent')).toBe('var(--textPrimarySuccess)');
    expect(button?.style.getPropertyValue('--fivra-button-border')).toBe('var(--borderPrimarySuccess)');

    element.setAttribute('variant', 'primary');
    await waitForUpdates();

    expect(button?.style.getPropertyValue('--fivra-button-surface')).toBe('var(--backgroundPrimarySuccess)');

    element.removeAttribute('color');
    await waitForUpdates();

    expect(button?.style.getPropertyValue('--fivra-button-accent')).toBe('');
  });

  it('renders label text from the label attribute when the slot is empty', async () => {
    const element = document.createElement('fivra-button') as FivraButtonElement;
    element.setAttribute('label', 'Continue');
    document.body.appendChild(element);

    await waitForUpdates();

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(button?.dataset.hasLabel).toBe('true');
    expect(element.shadowRoot?.querySelector('[data-label-text]')?.textContent).toBe('Continue');
  });

  it('applies semantic color aliases via the color attribute', async () => {
    const element = document.createElement('fivra-button') as FivraButtonElement;
    element.setAttribute('variant', 'secondary');
    element.setAttribute('color', 'primary-success');
    element.setAttribute('label', 'Continue');
    document.body.appendChild(element);

    await waitForUpdates();

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(button?.style.getPropertyValue('--fivra-button-accent')).toBe('var(--textPrimarySuccess)');
  });
});
