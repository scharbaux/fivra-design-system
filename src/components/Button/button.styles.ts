export const BUTTON_CLASS_NAME = 'fivra-button';
export const BUTTON_ICON_CLASS = `${BUTTON_CLASS_NAME}__icon`;
export const BUTTON_LABEL_CLASS = `${BUTTON_CLASS_NAME}__label`;
export const BUTTON_LEADING_ICON_CLASS = `${BUTTON_ICON_CLASS}--leading`;
export const BUTTON_TRAILING_ICON_CLASS = `${BUTTON_ICON_CLASS}--trailing`;

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'ghost'];
export const BUTTON_SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg'];

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_BUTTON_SIZE: ButtonSize = 'md';

const BASE_CLASS = `.${BUTTON_CLASS_NAME}`;
const ICON_CLASS = `.${BUTTON_ICON_CLASS}`;
const LABEL_CLASS = `.${BUTTON_LABEL_CLASS}`;

export const buttonClassStyles = `
${BASE_CLASS} {
  --fivra-button-font-family: inherit;
  --fivra-button-font-weight: 600;
  --fivra-button-radius: 9999px;
  --fivra-button-transition: background-color 160ms ease, color 160ms ease,
    box-shadow 160ms ease, border-color 160ms ease;
  --fivra-button-gap: 0.5rem;
  --fivra-button-padding-y: 0.5rem;
  --fivra-button-padding-x: 1rem;
  --fivra-button-font-size: 0.95rem;
  --fivra-button-line-height: 1.2;
  --fivra-button-min-height: 2.5rem;
  --fivra-button-icon-size: 1.1em;
  --fivra-button-primary-bg: var(--fivra-color-primary-600, #2563eb);
  --fivra-button-primary-bg-hover: var(--fivra-color-primary-700, #1d4ed8);
  --fivra-button-primary-bg-active: var(--fivra-color-primary-800, #1e40af);
  --fivra-button-primary-color: var(--fivra-color-neutral-0, #ffffff);
  --fivra-button-secondary-bg: transparent;
  --fivra-button-secondary-border: var(--fivra-color-neutral-300, #cbd5f5);
  --fivra-button-secondary-border-hover: var(--fivra-color-primary-500, #3b82f6);
  --fivra-button-secondary-color: var(--fivra-color-primary-700, #1d4ed8);
  --fivra-button-ghost-color: var(--fivra-color-primary-700, #1d4ed8);
  --fivra-button-ghost-bg-hover: rgba(37, 99, 235, 0.12);
  --fivra-button-focus-ring: 0 0 0 4px rgba(37, 99, 235, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--fivra-button-gap);
  padding: var(--fivra-button-padding-y) var(--fivra-button-padding-x);
  min-height: var(--fivra-button-min-height);
  border-radius: var(--fivra-button-radius);
  border: 1px solid transparent;
  background-color: var(--fivra-button-primary-bg);
  color: var(--fivra-button-primary-color);
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
}

${BASE_CLASS}[data-full-width='true'] {
  width: 100%;
}

${BASE_CLASS}[data-size='sm'] {
  --fivra-button-padding-y: 0.35rem;
  --fivra-button-padding-x: 0.85rem;
  --fivra-button-font-size: 0.85rem;
  --fivra-button-min-height: 2.125rem;
  --fivra-button-gap: 0.35rem;
}

${BASE_CLASS}[data-size='lg'] {
  --fivra-button-padding-y: 0.65rem;
  --fivra-button-padding-x: 1.25rem;
  --fivra-button-font-size: 1rem;
  --fivra-button-min-height: 2.875rem;
  --fivra-button-gap: 0.6rem;
}

${BASE_CLASS}[data-variant='secondary'] {
  background-color: var(--fivra-button-secondary-bg);
  color: var(--fivra-button-secondary-color);
  border-color: var(--fivra-button-secondary-border);
}

${BASE_CLASS}[data-variant='ghost'] {
  background-color: transparent;
  color: var(--fivra-button-ghost-color);
  border-color: transparent;
}

${BASE_CLASS}:hover:not(:disabled) {
  background-color: var(--fivra-button-primary-bg-hover);
}

${BASE_CLASS}[data-variant='secondary']:hover:not(:disabled) {
  border-color: var(--fivra-button-secondary-border-hover);
  background-color: rgba(59, 130, 246, 0.08);
}

${BASE_CLASS}[data-variant='ghost']:hover:not(:disabled) {
  background-color: var(--fivra-button-ghost-bg-hover);
}

${BASE_CLASS}:active:not(:disabled) {
  background-color: var(--fivra-button-primary-bg-active);
  transform: translateY(1px);
}

${BASE_CLASS}[data-variant='secondary']:active:not(:disabled) {
  background-color: rgba(59, 130, 246, 0.18);
}

${BASE_CLASS}[data-variant='ghost']:active:not(:disabled) {
  background-color: rgba(37, 99, 235, 0.2);
}

${BASE_CLASS}:focus-visible {
  outline: none;
  box-shadow: var(--fivra-button-focus-ring);
}

${BASE_CLASS}:disabled,
${BASE_CLASS}[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
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
  style.textContent = `${buttonClassStyles}`;
  document.head.appendChild(style);
  hasInjectedStyles = true;
}
