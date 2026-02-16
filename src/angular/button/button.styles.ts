import {
  COLOR_MIX_SUPPORTS_DECLARATION,
  createInteractiveStateLayerMixes,
} from './state-layer-mix';

export { COLOR_MIX_SUPPORTS_DECLARATION };

export const BOX_CLASS_NAME = 'fivra-box';
export const BUTTON_CLASS_NAME = 'fivra-button';
export const BUTTON_ICON_CLASS = `${BUTTON_CLASS_NAME}__icon`;
export const BUTTON_LABEL_CLASS = `${BUTTON_CLASS_NAME}__label`;
export const BUTTON_LEADING_ICON_CLASS = `${BUTTON_ICON_CLASS}--leading`;
export const BUTTON_TRAILING_ICON_CLASS = `${BUTTON_ICON_CLASS}--trailing`;
export const BUTTON_SPINNER_CLASS = `${BUTTON_CLASS_NAME}__spinner`;
export const BUTTON_CARET_CLASS = `${BUTTON_CLASS_NAME}__caret`;

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'tertiary'];
export const BUTTON_SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg'];

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_BUTTON_SIZE: ButtonSize = 'md';

const BASE_CLASS = `.${BUTTON_CLASS_NAME}`;
const BOX_BASE_CLASS = `.${BOX_CLASS_NAME}`;
const ICON_CLASS = `.${BUTTON_ICON_CLASS}`;
const LABEL_CLASS = `.${BUTTON_LABEL_CLASS}`;
const SPINNER_CLASS = `.${BUTTON_SPINNER_CLASS}`;
const CARET_CLASS = `.${BUTTON_CARET_CLASS}`;
const PRIMARY_BUTTON_STATE_MIXES = createInteractiveStateLayerMixes({
  tintColor: 'var(--fivra-button-state-tint)',
  focusColor: 'var(--fivra-button-focus-accent)',
  interactionOrder: 'layer-first',
});
const SECONDARY_TERTIARY_BUTTON_STATE_MIXES = createInteractiveStateLayerMixes({
  tintColor: 'var(--fivra-button-state-tint)',
  focusColor: 'var(--fivra-button-focus-accent)',
});

export const buttonClassStyles = `
${BOX_BASE_CLASS} {
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
}

${BASE_CLASS} {
  --fivra-button-font-family: var(--typography-body-1-font-family, 'Saans', sans-serif);
  --fivra-button-font-weight: 600;
  --fivra-button-radius: var(--radius-s);
  --fivra-button-transition: background-color 160ms ease, color 160ms ease,
    box-shadow 160ms ease, border-color 160ms ease, opacity 160ms ease;
  --fivra-button-gap: calc(8 * 1px);
  --fivra-button-padding-y: calc(8 * 1px);
  --fivra-button-padding-x: calc(16 * 1px);
  --fivra-button-font-size: 0.95rem;
  --fivra-button-line-height: 1.2;
  --fivra-button-height: calc(32 * 1px);
  --fivra-button-icon-size: var(--iconsizes-m);
  --fivra-button-spinner-size: calc(16 * 1px);
  --fivra-button-surface: var(--background-primary-interactive);
  --fivra-button-accent: var(--background-primary-interactive);
  --fivra-button-state-tint: var(--fivra-button-surface);
  --fivra-button-focus-accent: var(--background-primary-interactive);
  --fivra-button-hover-fallback: var(--state-brand-hover);
  --fivra-button-active-fallback: var(--state-brand-press);
  --fivra-button-hover-color: var(--fivra-button-hover-fallback);
  --fivra-button-active-color: var(--fivra-button-active-fallback);
  --fivra-button-hover-halo-fallback: var(--state-brand-hover);
  --fivra-button-active-halo-fallback: var(--state-brand-press);
  --fivra-button-focus-halo-fallback: var(--state-brand-focus);
  --fivra-button-hover-halo: var(--fivra-button-hover-halo-fallback);
  --fivra-button-active-halo: var(--fivra-button-active-halo-fallback);
  --fivra-button-focus-halo: var(--fivra-button-focus-halo-fallback);
  --fivra-button-border: var(--border-primary-interactive);
  --fivra-button-text: var(--background-neutral-0);
  --fivra-button-disabled-bg: var(--background-primary-disabled);
  --fivra-button-disabled-border: var(--border-primary-disabled);
  --fivra-button-disabled-text: var(--text-primary-disabled);
  --fivra-button-focus-ring-width: calc(var(--spacing-xs) * 1px);
  --fivra-button-focus-ring-color: var(--state-brand-focus);
  --fivra-button-shadow: calc(var(--shadows-mx) * 1px) calc(var(--shadows-my) * 1px)
    calc(var(--shadows-m-blur) * 1px) calc(var(--shadows-m-spread) * 1px) var(--shadows-m-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--fivra-button-gap);
  padding: var(--fivra-button-padding-y) var(--fivra-button-padding-x);
  min-height: var(--fivra-button-height);
  min-width: var(--fivra-button-height);
  border-radius: calc(var(--fivra-button-radius) * 1px);
  border-width: calc(var(--borderwidth-s) * 1px);
  border-style: solid;
  border-color: var(--fivra-button-border);
  background-color: var(--fivra-button-surface);
  color: var(--fivra-button-text);
  font-family: var(--fivra-button-font-family);
  font-weight: var(--fivra-button-font-weight);
  font-size: var(--fivra-button-font-size);
  line-height: var(--fivra-button-line-height);
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: var(--fivra-button-transition);
  position: relative;
  user-select: none;
  appearance: none;
  // box-shadow: var(--fivra-button-shadow);
}

${BASE_CLASS}[data-full-width='true'] {
  width: 100%;
}

${BASE_CLASS}[data-size='sm'] {
  --fivra-button-padding-y: calc(4 * 1px);
  --fivra-button-padding-x: calc(12 * 1px);
  --fivra-button-height: calc(24 * 1px);
  --fivra-button-radius: var(--radius-xs);
  --fivra-button-gap: calc(4 * 1px);
  --fivra-button-icon-size: var(--iconsizes-s);
  --fivra-button-spinner-size: calc(14 * 1px);
  --fivra-button-font-size: 0.85rem;
}

${BASE_CLASS}[data-size='lg'] {
  --fivra-button-padding-y: calc(12 * 1px);
  --fivra-button-padding-x: calc(24 * 1px);
  --fivra-button-height: calc(40 * 1px);
  --fivra-button-radius: var(--radius-m);
  --fivra-button-gap: calc(12 * 1px);
  --fivra-button-icon-size: var(--iconsizes-xl);
  --fivra-button-spinner-size: calc(20 * 1px);
  --fivra-button-font-size: 1rem;
}

${BASE_CLASS}[data-variant='secondary'] {
  --fivra-button-surface: var(--background-neutral-0);
  --fivra-button-accent: var(--text-primary-interactive);
  --fivra-button-state-tint: var(--fivra-button-border);
  --fivra-button-hover-fallback: var(--background-primary-selected);
  --fivra-button-active-fallback: var(--state-brand-press);
  --fivra-button-hover-halo-fallback: var(--background-primary-selected);
  --fivra-button-active-halo-fallback: var(--state-brand-press);
  --fivra-button-focus-halo-fallback: var(--state-brand-focus);
  --fivra-button-border: var(--border-primary-interactive);
  --fivra-button-text: var(--text-primary-interactive);
  --fivra-button-disabled-bg: var(--background-secondary-disabled);
  --fivra-button-disabled-border: var(--border-primary-disabled);
  --fivra-button-disabled-text: var(--text-primary-disabled);
}

${BASE_CLASS}[data-variant='tertiary'] {
  --fivra-button-surface: transparent;
  --fivra-button-accent: var(--text-primary-interactive);
  --fivra-button-state-tint: var(--fivra-button-text);
  --fivra-button-hover-fallback: var(--background-primary-selected);
  --fivra-button-active-fallback: var(--state-brand-press);
  --fivra-button-hover-halo-fallback: var(--background-primary-selected);
  --fivra-button-active-halo-fallback: var(--state-brand-press);
  --fivra-button-focus-halo-fallback: var(--state-brand-focus);
  --fivra-button-border: transparent;
  --fivra-button-text: var(--text-primary-interactive);
  --fivra-button-disabled-bg: transparent;
  --fivra-button-disabled-border: transparent;
  --fivra-button-disabled-text: var(--text-primary-disabled);
}

@supports (${COLOR_MIX_SUPPORTS_DECLARATION}) {
  ${BASE_CLASS} {
    --fivra-button-focus-ring-color: ${PRIMARY_BUTTON_STATE_MIXES.focusRingColor};
    --fivra-button-hover-color: ${PRIMARY_BUTTON_STATE_MIXES.hoverColor};
    --fivra-button-active-color: ${PRIMARY_BUTTON_STATE_MIXES.activeColor};
    --fivra-button-hover-halo: ${PRIMARY_BUTTON_STATE_MIXES.hoverHalo};
    --fivra-button-active-halo: ${PRIMARY_BUTTON_STATE_MIXES.activeHalo};
    --fivra-button-focus-halo: ${PRIMARY_BUTTON_STATE_MIXES.focusHalo};
  }

  ${BASE_CLASS}[data-variant='secondary'],
  ${BASE_CLASS}[data-variant='tertiary'] {
    --fivra-button-hover-color: ${SECONDARY_TERTIARY_BUTTON_STATE_MIXES.hoverColor};
    --fivra-button-active-color: ${SECONDARY_TERTIARY_BUTTON_STATE_MIXES.activeColor};
    --fivra-button-hover-halo: ${SECONDARY_TERTIARY_BUTTON_STATE_MIXES.hoverHalo};
    --fivra-button-active-halo: ${SECONDARY_TERTIARY_BUTTON_STATE_MIXES.activeHalo};
  }

  ${BASE_CLASS}:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-hover-color);
    box-shadow: var(--fivra-button-shadow), 0 0 0 4px var(--fivra-button-hover-halo);
  }

  ${BASE_CLASS}:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-active-color);
    box-shadow: var(--fivra-button-shadow), 0 0 0 6px var(--fivra-button-active-halo);
    transform: translateY(1px);
  }
}

@supports not (${COLOR_MIX_SUPPORTS_DECLARATION}) {
  ${BASE_CLASS}:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-hover-fallback);
    box-shadow: var(--fivra-button-shadow),
      0 0 0 4px var(--fivra-button-hover-halo-fallback);
  }

  ${BASE_CLASS}:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-active-fallback);
    box-shadow: var(--fivra-button-shadow),
      0 0 0 6px var(--fivra-button-active-halo-fallback);
    transform: translateY(1px);
  }

}

${BASE_CLASS}:focus-visible {
  outline: none;
  box-shadow: var(--fivra-button-shadow), 0 0 0 6px var(--fivra-button-focus-halo),
    0 0 0 var(--fivra-button-focus-ring-width) var(--fivra-button-focus-ring-color);
}

${BASE_CLASS}:disabled,
${BASE_CLASS}[aria-disabled='true'] {
  cursor: not-allowed;
  box-shadow: none;
  background-color: var(--fivra-button-disabled-bg);
  border-color: var(--fivra-button-disabled-border);
  color: var(--fivra-button-disabled-text);
}

${BASE_CLASS}[data-loading='true'] {
  cursor: progress;
  background-color: var(--fivra-button-surface);
  border-color: var(--fivra-button-border);
  color: var(--fivra-button-text);
  box-shadow: var(--fivra-button-shadow);
}

${BASE_CLASS}[data-loading='true']:disabled,
${BASE_CLASS}[data-loading='true'][aria-disabled='true'] {
  background-color: var(--fivra-button-surface);
  border-color: var(--fivra-button-border);
  color: var(--fivra-button-text);
  box-shadow: var(--fivra-button-shadow);
}

${BASE_CLASS}[data-icon-only='true'] {
  --fivra-button-gap: 0;
  --fivra-button-padding-x: 0;
  width: var(--fivra-button-height);
  padding-left: 0;
  padding-right: 0;
  border-radius: calc(var(--radius-max) * 1px);
}

${BASE_CLASS}[data-has-label='false'] ${LABEL_CLASS} {
  display: none;
}

${BASE_CLASS}[data-dropdown='true'] ${CARET_CLASS} {
  display: inline-flex;
}

${BASE_CLASS}[data-loading='true'] ${ICON_CLASS},
${BASE_CLASS}[data-loading='true'] ${LABEL_CLASS},
${BASE_CLASS}[data-loading='true'] ${CARET_CLASS} {
  opacity: 0;
}

${BASE_CLASS}[data-loading='true'] ${SPINNER_CLASS} {
  display: inline-flex;
}

${ICON_CLASS} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--fivra-button-icon-size);
  height: var(--fivra-button-icon-size);
  flex-shrink: 0;
  line-height: 1;
}

${ICON_CLASS} svg,
${ICON_CLASS} > * {
  width: 100%;
  height: 100%;
}

${ICON_CLASS}[data-empty='true'] {
  display: none !important;
}

${LABEL_CLASS} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

${SPINNER_CLASS} {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

${SPINNER_CLASS}::before {
  content: '';
  width: var(--fivra-button-spinner-size);
  height: var(--fivra-button-spinner-size);
  border-radius: 999px;
  border: calc(var(--borderwidth-s) * 1px) solid var(--border-primary-disabled);
  border-top-color: var(--fivra-button-text);
  animation: fivra-button-spin 0.8s linear infinite;
}

${CARET_CLASS} {
  display: none;
  align-items: center;
  justify-content: center;
  width: var(--fivra-button-icon-size);
  height: var(--fivra-button-icon-size);
  flex-shrink: 0;
}

${CARET_CLASS}::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-left: calc(var(--fivra-button-icon-size) / 3) solid transparent;
  border-right: calc(var(--fivra-button-icon-size) / 3) solid transparent;
  border-top: calc(var(--fivra-button-icon-size) / 3) solid currentColor;
}

@keyframes fivra-button-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

export const buttonHostStyles = `
:host {
  display: inline-block;
}

:host([hidden]) {
  display: none !important;
}

:host([full-width]) {
  width: 100%;
}
`;

let hasInjectedStyles = false;

export function ensureButtonStyles(): void {
  if (hasInjectedStyles || typeof document === 'undefined') {
    return;
  }

  if (document.querySelector(`style[data-fivra-button-styles="true"]`)) {
    hasInjectedStyles = true;
    return;
  }

  const style = document.createElement('style');
  style.dataset.fivraButtonStyles = 'true';
  style.textContent = `${buttonHostStyles}${buttonClassStyles}`;
  document.head.appendChild(style);
  hasInjectedStyles = true;
}
