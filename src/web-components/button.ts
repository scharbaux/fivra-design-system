import {
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  buttonClassStyles,
  buttonHostStyles,
} from '@components/Button/button.styles';

type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
type ButtonSize = (typeof BUTTON_SIZES)[number];

const template = document.createElement('template');

template.innerHTML = `
  <style>
    ${buttonHostStyles}
    ${buttonClassStyles}
    .${BUTTON_ICON_CLASS}[data-empty="true"] {
      display: none !important;
    }
  </style>
  <button
    class="${BUTTON_CLASS_NAME}"
    part="button"
    type="button"
    data-variant="${DEFAULT_BUTTON_VARIANT}"
    data-size="${DEFAULT_BUTTON_SIZE}"
  >
    <span class="${BUTTON_ICON_CLASS} ${BUTTON_ICON_CLASS}--leading" part="leading-icon" data-empty="true" aria-hidden="true">
      <slot name="leading-icon"></slot>
    </span>
    <span class="${BUTTON_LABEL_CLASS}" part="label"><slot></slot></span>
    <span class="${BUTTON_ICON_CLASS} ${BUTTON_ICON_CLASS}--trailing" part="trailing-icon" data-empty="true" aria-hidden="true">
      <slot name="trailing-icon"></slot>
    </span>
  </button>
`;

export class FivraButtonElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant', 'size', 'disabled', 'full-width', 'type'];
  }

  private readonly buttonEl: HTMLButtonElement;
  private readonly leadingWrapper: HTMLElement;
  private readonly trailingWrapper: HTMLElement;
  private readonly leadingSlot: HTMLSlotElement;
  private readonly trailingSlot: HTMLSlotElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));

    this.buttonEl = root.querySelector('button') as HTMLButtonElement;
    this.leadingWrapper = root.querySelector('[part="leading-icon"]') as HTMLElement;
    this.trailingWrapper = root.querySelector('[part="trailing-icon"]') as HTMLElement;
    this.leadingSlot = this.leadingWrapper.querySelector('slot') as HTMLSlotElement;
    this.trailingSlot = this.trailingWrapper.querySelector('slot') as HTMLSlotElement;
  }

  connectedCallback(): void {
    this.syncAll();
    this.leadingSlot.addEventListener('slotchange', this.syncSlots);
    this.trailingSlot.addEventListener('slotchange', this.syncSlots);
  }

  disconnectedCallback(): void {
    this.leadingSlot.removeEventListener('slotchange', this.syncSlots);
    this.trailingSlot.removeEventListener('slotchange', this.syncSlots);
  }

  attributeChangedCallback(): void {
    this.syncAll();
  }

  focus(options?: FocusOptions): void {
    this.buttonEl.focus(options);
  }

  click(): void {
    this.buttonEl.click();
  }

  get variant(): ButtonVariant {
    return (this.buttonEl.dataset.variant as ButtonVariant) ?? DEFAULT_BUTTON_VARIANT;
  }

  set variant(value: ButtonVariant) {
    this.setAttribute('variant', value);
  }

  get size(): ButtonSize {
    return (this.buttonEl.dataset.size as ButtonSize) ?? DEFAULT_BUTTON_SIZE;
  }

  set size(value: ButtonSize) {
    this.setAttribute('size', value);
  }

  get disabled(): boolean {
    return this.buttonEl.disabled;
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get fullWidth(): boolean {
    return this.hasAttribute('full-width');
  }

  set fullWidth(value: boolean) {
    this.toggleAttribute('full-width', value);
    this.syncFullWidth();
  }

  get type(): string {
    return this.buttonEl.type;
  }

  set type(value: string) {
    this.setAttribute('type', value);
  }

  private syncAll = (): void => {
    this.syncVariant();
    this.syncSize();
    this.syncDisabled();
    this.syncFullWidth();
    this.syncType();
    this.syncSlots();
  };

  private syncVariant(): void {
    const variantAttr = this.getAttribute('variant');
    const variant: ButtonVariant = variantAttr && BUTTON_VARIANTS.includes(variantAttr as ButtonVariant)
      ? (variantAttr as ButtonVariant)
      : DEFAULT_BUTTON_VARIANT;

    this.buttonEl.dataset.variant = variant;
  }

  private syncSize(): void {
    const sizeAttr = this.getAttribute('size');
    const size: ButtonSize = sizeAttr && BUTTON_SIZES.includes(sizeAttr as ButtonSize)
      ? (sizeAttr as ButtonSize)
      : DEFAULT_BUTTON_SIZE;

    this.buttonEl.dataset.size = size;
  }

  private syncDisabled(): void {
    const isDisabled = this.hasAttribute('disabled');
    this.buttonEl.disabled = isDisabled;
    if (isDisabled) {
      this.buttonEl.setAttribute('aria-disabled', 'true');
    } else {
      this.buttonEl.removeAttribute('aria-disabled');
    }
  }

  private syncFullWidth(): void {
    const fullWidth = this.hasAttribute('full-width');
    this.toggleAttribute('full-width', fullWidth);
    if (fullWidth) {
      this.buttonEl.dataset.fullWidth = 'true';
    } else {
      delete this.buttonEl.dataset.fullWidth;
    }
  }

  private syncType(): void {
    const typeAttr = this.getAttribute('type');
    this.buttonEl.type = typeAttr === 'submit' || typeAttr === 'reset' ? typeAttr : 'button';
  }

  private syncSlots = (): void => {
    this.toggleWrapper(this.leadingSlot, this.leadingWrapper);
    this.toggleWrapper(this.trailingSlot, this.trailingWrapper);
  };

  private toggleWrapper(slot: HTMLSlotElement, wrapper: HTMLElement): void {
    const hasContent = slot
      .assignedNodes()
      .some((node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0);
    wrapper.dataset.empty = hasContent ? 'false' : 'true';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fivra-button': FivraButtonElement;
  }
}

export function defineFivraButton(): void {
  if (typeof window === 'undefined' || window.customElements.get('fivra-button')) {
    return;
  }

  window.customElements.define('fivra-button', FivraButtonElement);
}
