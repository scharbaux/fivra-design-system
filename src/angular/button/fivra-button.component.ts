import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
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
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  ensureButtonStyles,
  type ButtonSize,
  type ButtonVariant,
} from '@components/Button/button.styles';

import {
  FivraButtonLeadingIconDirective,
  FivraButtonTrailingIconDirective,
} from './fivra-button.directives';

function coerceBoolean(value: unknown): boolean {
  if (value === '' || value === true) {
    return true;
  }

  if (value === false || value === null || value === undefined) {
    return false;
  }

  return value !== 'false';
}

@Component({
  selector: 'fivra-button',
  template: `
    <button
      #buttonElement
      [attr.type]="buttonType"
      class="${BUTTON_CLASS_NAME}"
      [attr.data-variant]="variant"
      [attr.data-size]="size"
      [attr.data-full-width]="fullWidth ? 'true' : null"
      [attr.data-icon-only]="iconOnly ? 'true' : null"
      [attr.data-has-label]="resolvedHasLabel ? 'true' : 'false'"
      [attr.data-dropdown]="dropdown ? 'true' : null"
      [attr.data-loading]="loading ? 'true' : null"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel ?? null"
      [attr.aria-labelledby]="ariaLabelledby ?? null"
      [attr.aria-busy]="loading ? 'true' : null"
    >
      <span class="${BUTTON_SPINNER_CLASS}" aria-hidden="true"></span>
      <span
        class="${BUTTON_ICON_CLASS} ${BUTTON_LEADING_ICON_CLASS}"
        aria-hidden="true"
        [attr.data-empty]="leadingIconPresent ? 'false' : 'true'"
      >
        <ng-container *ngIf="leadingIcon">
          <ng-container *ngTemplateOutlet="leadingIcon"></ng-container>
        </ng-container>
        <ng-content select="[fivraButtonLeadingIcon]"></ng-content>
      </span>
      <span
        #labelWrapper
        class="${BUTTON_LABEL_CLASS}"
        [attr.data-empty]="resolvedHasLabel ? 'false' : 'true'"
      >
        <ng-content></ng-content>
      </span>
      <span
        class="${BUTTON_ICON_CLASS} ${BUTTON_TRAILING_ICON_CLASS}"
        aria-hidden="true"
        [attr.data-empty]="trailingIconPresent ? 'false' : 'true'"
      >
        <ng-content select="[fivraButtonTrailingIcon]"></ng-content>
        <ng-container *ngIf="trailingIcon">
          <ng-container *ngTemplateOutlet="trailingIcon"></ng-container>
        </ng-container>
      </span>
      <span class="${BUTTON_CARET_CLASS}" aria-hidden="true"></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FivraButtonComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy
{
  private _variant: ButtonVariant = DEFAULT_BUTTON_VARIANT;
  private _size: ButtonSize = DEFAULT_BUTTON_SIZE;
  private _fullWidth = false;
  private _iconOnly = false;
  private _hasLabelInput: boolean | undefined;
  private _dropdown = false;
  private _loading = false;
  private _disabled = false;
  private _type: 'button' | 'submit' | 'reset' = 'button';
  private _leadingIcon?: TemplateRef<unknown>;
  private _trailingIcon?: TemplateRef<unknown>;
  private labelObserver?: MutationObserver;
  private labelHasContent = false;
  private leadingIconsChangesSub?: Subscription;
  private trailingIconsChangesSub?: Subscription;

  ariaLabel: string | null = null;
  ariaLabelledby: string | null = null;

  @ViewChild('buttonElement', { static: true })
  private readonly buttonElement!: ElementRef<HTMLButtonElement>;

  @ViewChild('labelWrapper', { static: true })
  private readonly labelWrapper!: ElementRef<HTMLSpanElement>;

  @ContentChildren(FivraButtonLeadingIconDirective, { descendants: true })
  private readonly leadingIconDirectives!: QueryList<FivraButtonLeadingIconDirective>;

  @ContentChildren(FivraButtonTrailingIconDirective, { descendants: true })
  private readonly trailingIconDirectives!: QueryList<FivraButtonTrailingIconDirective>;

  private readonly cdr = inject(ChangeDetectorRef);

  @Input()
  set variant(value: ButtonVariant | null | undefined) {
    this._variant = value ?? DEFAULT_BUTTON_VARIANT;
    this.cdr.markForCheck();
  }
  get variant(): ButtonVariant {
    return this._variant;
  }

  @Input()
  set size(value: ButtonSize | null | undefined) {
    this._size = value ?? DEFAULT_BUTTON_SIZE;
    this.cdr.markForCheck();
  }
  get size(): ButtonSize {
    return this._size;
  }

  @Input()
  set fullWidth(value: boolean | string | null | undefined) {
    this._fullWidth = coerceBoolean(value);
    this.cdr.markForCheck();
  }
  get fullWidth(): boolean {
    return this._fullWidth;
  }

  @Input()
  set iconOnly(value: boolean | string | null | undefined) {
    this._iconOnly = coerceBoolean(value);
    this.cdr.markForCheck();
  }
  get iconOnly(): boolean {
    return this._iconOnly;
  }

  @Input()
  set hasLabel(value: boolean | string | null | undefined) {
    if (value === '' || value === 'true' || value === true) {
      this._hasLabelInput = true;
    } else if (value === 'false' || value === false) {
      this._hasLabelInput = false;
    } else {
      this._hasLabelInput = undefined;
    }
    this.cdr.markForCheck();
  }

  @Input()
  set dropdown(value: boolean | string | null | undefined) {
    this._dropdown = coerceBoolean(value);
    this.cdr.markForCheck();
  }
  get dropdown(): boolean {
    return this._dropdown;
  }

  @Input()
  set loading(value: boolean | string | null | undefined) {
    this._loading = coerceBoolean(value);
    this.cdr.markForCheck();
  }
  get loading(): boolean {
    return this._loading;
  }

  @Input()
  set type(value: 'button' | 'submit' | 'reset' | null | undefined) {
    this._type = value ?? 'button';
    this.cdr.markForCheck();
  }
  get buttonType(): 'button' | 'submit' | 'reset' {
    return this._type;
  }

  @Input()
  set disabled(value: boolean | string | null | undefined) {
    this._disabled = coerceBoolean(value);
    this.cdr.markForCheck();
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set leadingIcon(value: TemplateRef<unknown> | null | undefined) {
    this._leadingIcon = value ?? undefined;
    this.cdr.markForCheck();
  }
  get leadingIcon(): TemplateRef<unknown> | undefined {
    return this._leadingIcon;
  }

  @Input()
  set trailingIcon(value: TemplateRef<unknown> | null | undefined) {
    this._trailingIcon = value ?? undefined;
    this.cdr.markForCheck();
  }
  get trailingIcon(): TemplateRef<unknown> | undefined {
    return this._trailingIcon;
  }

  @Input('ariaLabel')
  set ariaLabelInput(value: string | null | undefined) {
    this.ariaLabel = value ?? null;
    this.cdr.markForCheck();
  }

  @Input('ariaLabelledby')
  set ariaLabelledbyInput(value: string | null | undefined) {
    this.ariaLabelledby = value ?? null;
    this.cdr.markForCheck();
  }

  get resolvedHasLabel(): boolean {
    if (typeof this._hasLabelInput === 'boolean') {
      return this._hasLabelInput;
    }

    return !this.iconOnly && this.labelHasContent;
  }

  get leadingIconPresent(): boolean {
    const projected = this.leadingIconDirectives?.length ?? 0;
    return projected > 0 || Boolean(this.leadingIcon);
  }

  get trailingIconPresent(): boolean {
    const projected = this.trailingIconDirectives?.length ?? 0;
    return projected > 0 || Boolean(this.trailingIcon);
  }

  ngOnInit(): void {
    ensureButtonStyles();
  }

  ngAfterViewInit(): void {
    this.updateLabelPresence();
    this.setupLabelObserver();
  }

  ngAfterContentInit(): void {
    this.leadingIconsChangesSub = this.leadingIconDirectives.changes.subscribe(() => {
      this.cdr.markForCheck();
    });

    this.trailingIconsChangesSub = this.trailingIconDirectives.changes.subscribe(() => {
      this.cdr.markForCheck();
    });

    // Ensure wrappers reflect initial projected icon state.
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.labelObserver?.disconnect();
    this.leadingIconsChangesSub?.unsubscribe();
    this.trailingIconsChangesSub?.unsubscribe();
  }

  focus(options?: FocusOptions): void {
    this.buttonElement.nativeElement.focus(options);
  }

  click(): void {
    this.buttonElement.nativeElement.click();
  }

  private setupLabelObserver(): void {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.labelObserver = new MutationObserver(() => {
      this.updateLabelPresence();
    });

    this.labelObserver.observe(this.labelWrapper.nativeElement, {
      characterData: true,
      subtree: true,
      childList: true,
    });
  }

  private updateLabelPresence(): void {
    const element = this.labelWrapper.nativeElement;
    const text = element.textContent ?? '';
    this.labelHasContent = text.trim().length > 0 || element.children.length > 0;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
