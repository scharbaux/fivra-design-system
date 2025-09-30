import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { defineFivraButton, FivraButtonElement } from '@web-components';

const BRAND_HOVER_MIX =
  "--fivra-button-hover-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandHoverPercent), var(--fivra-button-accent));";
const BRAND_ACTIVE_MIX =
  "--fivra-button-active-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandActivePercent), var(--fivra-button-accent));";
const BRAND_FOCUS_MIX =
  "--fivra-button-focus-ring-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandFocusPercent), var(--fivra-button-accent));";
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

  it('applies the balanced halo weighting when the attribute is set', () => {
    const balancedElement = document.createElement('fivra-button') as FivraButtonElement;
    balancedElement.setAttribute('balanced-halo', '');
    document.body.appendChild(balancedElement);

    const balancedButton = balancedElement.shadowRoot?.querySelector('button') as HTMLButtonElement;
    const styles = queryShadowStyles(balancedElement);

    expect(balancedButton.className).toContain('fivra-button--balanced-halo');
    expect(styles).toContain('.fivra-button.fivra-button--balanced-halo {');
    expect(styles).toContain(
      "--fivra-button-hover-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandHoverPercent));",
    );
    expect(styles).toContain(
      "--fivra-button-active-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandActivePercent));",
    );
    expect(styles).toContain(
      "--fivra-button-focus-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandFocusPercent));",
    );
    expect(styles).toContain(
      "--fivra-button-hover-halo: var(--fivra-button-hover-halo-fallback);",
    );
    expect(styles).toContain(
      "--fivra-button-active-halo: var(--fivra-button-active-halo-fallback);",
    );
    expect(styles).toContain(
      "--fivra-button-focus-halo: var(--fivra-button-focus-halo-fallback);",
    );
  });
});
