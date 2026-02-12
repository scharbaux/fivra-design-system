import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Renderer2,
  inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  BUTTON_CARET_CLASS,
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from '@components/Button/button.styles';
import type { ButtonColor, ButtonSemanticStyleOverrides } from './color-overrides';
import { createButtonColorOverrides } from './color-overrides';

import {
  FivraButtonLeadingIconDirective,
  FivraButtonTrailingIconDirective,
} from './fivra-button.directives';

type BooleanInput = boolean | string | null | undefined;
type ButtonType = 'button' | 'submit' | 'reset';

function coerceBooleanProperty(value: BooleanInput): boolean {
  if (value === '' || value === true) {
    return true;
  }

  if (value === false || value == null) {
    return false;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'false' || normalized === '0' || normalized === 'null') {
      return false;
    }

    return normalized.length > 0;
  }

  return Boolean(value);
}

function isButtonVariant(value: unknown): value is ButtonVariant {
  return BUTTON_VARIANTS.includes(value as ButtonVariant);
}

function isButtonSize(value: unknown): value is ButtonSize {
  return BUTTON_SIZES.includes(value as ButtonSize);
}

function isButtonColor(value: unknown): value is ButtonColor {
  return value === 'primary-success' || value === 'primary-warning' || value === 'primary-error';
}

const TONE_STYLE_VARS: Array<keyof ButtonSemanticStyleOverrides> = [
  '--fivra-button-surface',
  '--fivra-button-accent',
  '--fivra-button-border',
  '--fivra-button-text',
  '--fivra-button-hover-fallback',
  '--fivra-button-active-fallback',
];

type DirectStyleKey =
  | '--fivra-button-surface'
  | '--fivra-button-accent'
  | '--fivra-button-border'
  | '--fivra-button-text';

const DIRECT_STYLE_VARS: DirectStyleKey[] = [
  '--fivra-button-surface',
  '--fivra-button-accent',
  '--fivra-button-border',
  '--fivra-button-text',
];

function capitalizeTokenSegment(segment: string): string {
  if (!segment) {
    return segment;
  }

  return segment[0].toUpperCase() + segment.slice(1);
}

function toCssVariableName(token: string): string {
  const [first, ...rest] = token.split('-');
  const suffix = rest.map(capitalizeTokenSegment).join('');
  return `--${first}${suffix}`;
}

function isDesignToken(value: string): boolean {
  return /^[a-z]+(?:-[a-z0-9]+)+$/i.test(value);
}

function resolveColorValue(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith('var(') || value.startsWith('calc(')) {
    return value;
  }

  if (isDesignToken(value)) {
    return `var(${toCssVariableName(value)})`;
  }

  return value;
}

@Component({
  selector: 'fivra-button',
  template: `
    <button
      #buttonElement
      [attr.type]="type"
      [attr.data-variant]="variant"
      [attr.data-size]="size"
      [attr.data-full-width]="fullWidth ? 'true' : null"
      [attr.data-icon-only]="iconOnly ? 'true' : null"
      [attr.data-has-label]="resolvedHasLabel ? 'true' : 'false'"
      [attr.data-dropdown]="dropdown ? 'true' : null"
      [attr.data-loading]="loading ? 'true' : null"
      [attr.aria-label]="ariaLabel ?? null"
      [attr.aria-labelledby]="ariaLabelledby ?? null"
      [attr.aria-haspopup]="resolvedAriaHaspopup"
      [attr.aria-expanded]="ariaExpanded ?? null"
      [attr.aria-busy]="loading ? 'true' : null"
      [disabled]="disabled"
      [class]="buttonClassName"
    >
      <span
        *ngIf="loading"
        class="{{ spinnerClassName }}"
        aria-hidden="true"
      ></span>
      <span
        class="{{ leadingIconClassName }}"
        aria-hidden="true"
        [attr.data-empty]="hasLeadingIcon ? null : 'true'"
      >
        <ng-container *ngIf="leadingIconTemplate" [ngTemplateOutlet]="leadingIconTemplate"></ng-container>
        <ng-content select="[fivraButtonLeadingIcon]"></ng-content>
      </span>
      <span
        #labelContainer
        class="{{ labelClassName }}"
        [attr.data-empty]="resolvedHasLabel ? null : 'true'"
      >
        <ng-container *ngIf="!hasProjectedLabel && label">{{ label }}</ng-container>
        <ng-content></ng-content>
      </span>
      <span
        class="{{ trailingIconClassName }}"
        aria-hidden="true"
        [attr.data-empty]="hasTrailingIcon ? null : 'true'"
      >
        <ng-container *ngIf="trailingIconTemplate" [ngTemplateOutlet]="trailingIconTemplate"></ng-container>
        <ng-content select="[fivraButtonTrailingIcon]"></ng-content>
      </span>
      <span *ngIf="dropdown" class="{{ caretClassName }}" aria-hidden="true"></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FivraButtonLeadingIconDirective,
    FivraButtonTrailingIconDirective,
  ],
})
export class FivraButtonComponent
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy
{
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly hostElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  readonly buttonClassName = BUTTON_CLASS_NAME;
  readonly spinnerClassName = BUTTON_SPINNER_CLASS;
  readonly labelClassName = BUTTON_LABEL_CLASS;
  readonly leadingIconClassName = `${BUTTON_ICON_CLASS} ${BUTTON_LEADING_ICON_CLASS}`;
  readonly trailingIconClassName = `${BUTTON_ICON_CLASS} ${BUTTON_TRAILING_ICON_CLASS}`;
  readonly caretClassName = BUTTON_CARET_CLASS;

  private readonly subscriptions = new Subscription();
  private _variant: ButtonVariant = DEFAULT_BUTTON_VARIANT;
  private _size: ButtonSize = DEFAULT_BUTTON_SIZE;
  private _type: ButtonType = 'button';
  private _color: ButtonColor | null = null;
  private _fullWidth = false;
  private _iconOnly = false;
  private _dropdown = false;
  private _loading = false;
  private _disabled = false;
  private _label: string | null = null;
  private _surfaceColor: string | null = null;
  private _borderColor: string | null = null;
  private _textColor: string | null = null;
  private _accentColor: string | null = null;
  private _hasLabelOverride: boolean | null = null;
  private _leadingIconTemplate: TemplateRef<unknown> | null = null;
  private _trailingIconTemplate: TemplateRef<unknown> | null = null;
  private hasProjectedLeadingIcon = false;
  private hasProjectedTrailingIcon = false;
  hasProjectedLabel = false;
  private labelObserver?: MutationObserver;
  private hostStyleObserver?: MutationObserver;
  private _ariaHaspopup: string | null = null;
  private _ariaExpanded: string | null = null;

  @ContentChildren(FivraButtonLeadingIconDirective, { descendants: true })
  private leadingIconDirectives?: QueryList<FivraButtonLeadingIconDirective>;

  @ContentChildren(FivraButtonTrailingIconDirective, { descendants: true })
  private trailingIconDirectives?: QueryList<FivraButtonTrailingIconDirective>;

  @ViewChild('buttonElement', { static: true })
  private readonly buttonElement!: ElementRef<HTMLButtonElement>;

  @ViewChild('labelContainer')
  private readonly labelContainer?: ElementRef<HTMLSpanElement>;

  @Input()
  set variant(value: ButtonVariant | string | null | undefined) {
    this._variant = isButtonVariant(value) ? (value as ButtonVariant) : DEFAULT_BUTTON_VARIANT;
    this.applyVisualOverrides();
    this.cdr.markForCheck();
  }
  get variant(): ButtonVariant {
    return this._variant;
  }

  @Input()
  set color(value: ButtonColor | string | null | undefined) {
    this._color = isButtonColor(value) ? (value as ButtonColor) : null;
    this.applyVisualOverrides();
    this.cdr.markForCheck();
  }
  get color(): ButtonColor | null {
    return this._color;
  }

  @Input()
  set label(value: string | null | undefined) {
    this._label = value ?? null;
    this.cdr.markForCheck();
  }
  get label(): string | null {
    return this._label;
  }

  @Input()
  set surfaceColor(value: string | null | undefined) {
    this._surfaceColor = value ?? null;
    this.applyVisualOverrides();
    this.cdr.markForCheck();
  }
  get surfaceColor(): string | null {
    return this._surfaceColor;
  }

  @Input()
  set borderColor(value: string | null | undefined) {
    this._borderColor = value ?? null;
    this.applyVisualOverrides();
    this.cdr.markForCheck();
  }
  get borderColor(): string | null {
    return this._borderColor;
  }

  @Input()
  set textColor(value: string | null | undefined) {
    this._textColor = value ?? null;
    this.applyVisualOverrides();
    this.cdr.markForCheck();
  }
  get textColor(): string | null {
    return this._textColor;
  }

  @Input()
  set accentColor(value: string | null | undefined) {
    this._accentColor = value ?? null;
    this.applyVisualOverrides();
    this.cdr.markForCheck();
  }
  get accentColor(): string | null {
    return this._accentColor;
  }

  @Input()
  set size(value: ButtonSize | string | null | undefined) {
    this._size = isButtonSize(value) ? (value as ButtonSize) : DEFAULT_BUTTON_SIZE;
    this.cdr.markForCheck();
  }
  get size(): ButtonSize {
    return this._size;
  }

  @Input()
  set type(value: ButtonType | string | null | undefined) {
    if (value === 'submit' || value === 'reset' || value === 'button') {
      this._type = value;
    } else {
      this._type = 'button';
    }
    this.cdr.markForCheck();
  }
  get type(): ButtonType {
    return this._type;
  }

  @Input()
  set fullWidth(value: BooleanInput) {
    this._fullWidth = coerceBooleanProperty(value);
    this.cdr.markForCheck();
  }
  get fullWidth(): boolean {
    return this._fullWidth;
  }

  @Input()
  set iconOnly(value: BooleanInput) {
    this._iconOnly = coerceBooleanProperty(value);
    this.cdr.markForCheck();
  }
  get iconOnly(): boolean {
    return this._iconOnly;
  }

  @Input()
  set hasLabel(value: BooleanInput) {
    if (value == null) {
      this._hasLabelOverride = null;
    } else {
      this._hasLabelOverride = coerceBooleanProperty(value);
    }
    this.cdr.markForCheck();
  }
  get hasLabel(): boolean | null {
    return this._hasLabelOverride;
  }

  @Input()
  set dropdown(value: BooleanInput) {
    this._dropdown = coerceBooleanProperty(value);
    this.cdr.markForCheck();
  }
  get dropdown(): boolean {
    return this._dropdown;
  }

  @Input()
  set loading(value: BooleanInput) {
    this._loading = coerceBooleanProperty(value);
    this.cdr.markForCheck();
  }
  get loading(): boolean {
    return this._loading;
  }

  @Input()
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this.cdr.markForCheck();
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  ariaLabel: string | null | undefined;

  @Input()
  ariaLabelledby: string | null | undefined;

  @Input()
  set ariaHaspopup(value: string | null | undefined) {
    this._ariaHaspopup = value ?? null;
    this.cdr.markForCheck();
  }
  get ariaHaspopup(): string | null {
    return this._ariaHaspopup;
  }

  @Input()
  set ariaExpanded(value: BooleanInput) {
    if (value == null) {
      this._ariaExpanded = null;
    } else {
      this._ariaExpanded = coerceBooleanProperty(value) ? 'true' : 'false';
    }
    this.cdr.markForCheck();
  }
  get ariaExpanded(): string | null {
    return this._ariaExpanded;
  }

  @Input()
  set leadingIcon(value: TemplateRef<unknown> | null | undefined) {
    this._leadingIconTemplate = value ?? null;
    this.updateIconPresence();
  }
  get leadingIconTemplate(): TemplateRef<unknown> | null {
    return this._leadingIconTemplate;
  }

  @Input()
  set trailingIcon(value: TemplateRef<unknown> | null | undefined) {
    this._trailingIconTemplate = value ?? null;
    this.updateIconPresence();
  }
  get trailingIconTemplate(): TemplateRef<unknown> | null {
    return this._trailingIconTemplate;
  }

  get hasLeadingIcon(): boolean {
    return Boolean(this._leadingIconTemplate || this.hasProjectedLeadingIcon);
  }

  get hasTrailingIcon(): boolean {
    return Boolean(this._trailingIconTemplate || this.hasProjectedTrailingIcon);
  }

  get resolvedHasLabel(): boolean {
    if (this._hasLabelOverride !== null) {
      return this._hasLabelOverride;
    }

    if (this.iconOnly) {
      return false;
    }

    return this.hasProjectedLabel || Boolean(this._label && this._label.trim().length > 0);
  }

  get resolvedAriaHaspopup(): string | null {
    return this._ariaHaspopup ?? (this.dropdown ? 'menu' : null);
  }

  ngOnInit(): void {
    ensureButtonStyles();
    this.observeHostInlineStyles();
    this.applyVisualOverrides();
  }

  ngAfterContentInit(): void {
    this.updateIconPresence();

    if (this.leadingIconDirectives) {
      this.subscriptions.add(
        this.leadingIconDirectives.changes.subscribe(() => {
          this.hasProjectedLeadingIcon = (this.leadingIconDirectives?.length ?? 0) > 0;
          this.cdr.markForCheck();
        }),
      );

      this.hasProjectedLeadingIcon = this.leadingIconDirectives.length > 0;
    }

    if (this.trailingIconDirectives) {
      this.subscriptions.add(
        this.trailingIconDirectives.changes.subscribe(() => {
          this.hasProjectedTrailingIcon = (this.trailingIconDirectives?.length ?? 0) > 0;
          this.cdr.markForCheck();
        }),
      );

      this.hasProjectedTrailingIcon = this.trailingIconDirectives.length > 0;
    }

    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    this.observeLabelContent();
    this.updateLabelPresence();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.labelObserver?.disconnect();
    this.hostStyleObserver?.disconnect();
  }

  focus(options?: FocusOptions): void {
    this.buttonElement.nativeElement.focus(options);
  }

  click(): void {
    this.buttonElement.nativeElement.click();
  }

  private updateIconPresence(): void {
    this.hasProjectedLeadingIcon = (this.leadingIconDirectives?.length ?? 0) > 0;
    this.hasProjectedTrailingIcon = (this.trailingIconDirectives?.length ?? 0) > 0;
    this.cdr.markForCheck();
  }

  private observeLabelContent(): void {
    if (!this.labelContainer) {
      return;
    }

    this.labelObserver?.disconnect();
    this.labelObserver = new MutationObserver(() => {
      this.updateLabelPresence();
    });
    this.labelObserver.observe(this.labelContainer.nativeElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  private updateLabelPresence(): void {
    const container = this.labelContainer?.nativeElement;
    if (!container) {
      this.hasProjectedLabel = false;
      this.cdr.markForCheck();
      return;
    }

    const hasContent = Array.from(container.childNodes).some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return true;
      }

      if (node.nodeType === Node.TEXT_NODE) {
        return (node.textContent ?? '').trim().length > 0;
      }

      return false;
    });

    if (this.hasProjectedLabel !== hasContent) {
      this.hasProjectedLabel = hasContent;
      this.cdr.markForCheck();
    } else {
      this.cdr.markForCheck();
    }
  }

  private syncHostInlineStyles(): void {
    const hostElement = this.hostElementRef.nativeElement;
    const button = this.buttonElement?.nativeElement;

    if (!button) {
      return;
    }

    // Use cssText to capture styles applied via Renderer2/setProperty even when
    // the serialized style attribute isn't updated (e.g., in some DOM shims/tests).
    const hostStyle = hostElement.style.cssText;

    if (!hostStyle || hostStyle.trim().length === 0) {
      this.renderer.removeAttribute(button, 'style');
      return;
    }

    this.renderer.setAttribute(button, 'style', hostStyle);
  }

  private applyVisualOverrides(): void {
    const hostElement = this.hostElementRef.nativeElement;

    // Clear semantic layer vars first, then re-apply derived overrides.
    for (const key of TONE_STYLE_VARS) {
      hostElement.style.removeProperty(key);
    }

    const semantic = this._color
      ? createButtonColorOverrides(this._variant, this._color)
      : null;

    if (semantic) {
      for (const key of TONE_STYLE_VARS) {
        const value = semantic[key];
        if (value) {
          hostElement.style.setProperty(key, value);
        }
      }
    }

    const direct: Record<DirectStyleKey, string | null> = {
      '--fivra-button-surface': resolveColorValue(this._surfaceColor),
      '--fivra-button-border': resolveColorValue(this._borderColor),
      '--fivra-button-text': resolveColorValue(this._textColor),
      '--fivra-button-accent': resolveColorValue(this._accentColor),
    };

    for (const key of DIRECT_STYLE_VARS) {
      const value = direct[key];
      if (value) {
        hostElement.style.setProperty(key, value);
      }
    }

    this.syncHostInlineStyles();
  }

  private observeHostInlineStyles(): void {
    const hostElement = this.hostElementRef.nativeElement;

    this.hostStyleObserver?.disconnect();

    this.hostStyleObserver = new MutationObserver(() => {
      this.syncHostInlineStyles();
    });

    this.hostStyleObserver.observe(hostElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    this.syncHostInlineStyles();
  }
}
