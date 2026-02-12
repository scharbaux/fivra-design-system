import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  BUTTON_CARET_CLASS,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
} from '../button.styles';
import { FivraButtonComponent, FivraButtonModule } from '../../button';

@Component({
  template: `
    <fivra-button
      [variant]="variant"
      [color]="color"
      [label]="label"
      [size]="size"
      [fullWidth]="fullWidth"
      [iconOnly]="iconOnly"
      [hasLabel]="hasLabel"
      [dropdown]="dropdown"
      [loading]="loading"
      [type]="type"
      [disabled]="disabled"
      [ariaHaspopup]="ariaHaspopup"
      [ariaExpanded]="ariaExpanded"
      [ariaLabel]="ariaLabel"
      [ariaLabelledby]="ariaLabelledby"
      [leadingIcon]="useLeadingTemplate ? leadingIconTpl : null"
      [trailingIcon]="useTrailingTemplate ? trailingIconTpl : null"
    >
      <ng-container *ngIf="showLabel">{{ labelText }}</ng-container>
      <ng-container *ngIf="useLeadingDirective">
        <span fivraButtonLeadingIcon>LD</span>
      </ng-container>
      <ng-container *ngIf="useTrailingDirective">
        <span fivraButtonTrailingIcon>TR</span>
      </ng-container>
    </fivra-button>

    <ng-template #leadingIconTpl>
      <span class="template-leading">TLead</span>
    </ng-template>
    <ng-template #trailingIconTpl>
      <span class="template-trailing">TTrail</span>
    </ng-template>
  `,
})
class ButtonHostComponent {
  variant: ButtonVariant | undefined = DEFAULT_BUTTON_VARIANT;
  color: 'primary-success' | 'primary-warning' | 'primary-error' | undefined = undefined;
  label: string | undefined = undefined;
  size: ButtonSize | undefined = DEFAULT_BUTTON_SIZE;
  fullWidth = false;
  iconOnly = false;
  hasLabel: boolean | null | undefined = undefined;
  dropdown = false;
  loading = false;
  type: 'button' | 'submit' | 'reset' | undefined = undefined;
  disabled = false;
  ariaHaspopup: string | null | undefined = undefined;
  ariaExpanded: boolean | null | undefined = undefined;
  ariaLabel: string | null | undefined = undefined;
  ariaLabelledby: string | null | undefined = undefined;
  showLabel = true;
  labelText = 'Primary action';
  useLeadingDirective = false;
  useTrailingDirective = false;
  useLeadingTemplate = false;
  useTrailingTemplate = false;

  @ViewChild(FivraButtonComponent, { static: true })
  buttonComponent!: FivraButtonComponent;
}

describe('FivraButtonComponent', () => {
  let fixture: ComponentFixture<ButtonHostComponent>;
  let hostComponent: ButtonHostComponent;

  const flushChanges = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FivraButtonModule],
      declarations: [ButtonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonHostComponent);
    hostComponent = fixture.componentInstance;
    await flushChanges();
  });

  const queryButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('button');

  const queryLeadingWrapper = (): HTMLElement | null =>
    fixture.nativeElement.querySelector(
      `.${BUTTON_ICON_CLASS}.${BUTTON_LEADING_ICON_CLASS}`,
    );

  const queryTrailingWrapper = (): HTMLElement | null =>
    fixture.nativeElement.querySelector(
      `.${BUTTON_ICON_CLASS}.${BUTTON_TRAILING_ICON_CLASS}`,
    );

  const queryLabelWrapper = (): HTMLElement | null =>
    fixture.nativeElement.querySelector(`.${BUTTON_LABEL_CLASS}`);

  const queryCaret = (): HTMLElement | null =>
    fixture.nativeElement.querySelector(`.${BUTTON_CARET_CLASS}`);

  const querySpinner = (): HTMLElement | null =>
    fixture.nativeElement.querySelector(`.${BUTTON_SPINNER_CLASS}`);

  it('renders defaults and core attributes', () => {
    const button = queryButton();
    expect(button).toBeTruthy();
    expect(button.dataset.variant).toBe(DEFAULT_BUTTON_VARIANT);
    expect(button.dataset.size).toBe(DEFAULT_BUTTON_SIZE);
    expect(button.dataset.hasLabel).toBe('true');
    expect(button.dataset.fullWidth).toBeUndefined();
    expect(button.dataset.iconOnly).toBeUndefined();
    expect(button.dataset.dropdown).toBeUndefined();
    expect(button.dataset.loading).toBeUndefined();
    expect(button.getAttribute('aria-busy')).toBeNull();
    expect(button.getAttribute('aria-haspopup')).toBeNull();

    const leading = queryLeadingWrapper();
    const trailing = queryTrailingWrapper();
    const label = queryLabelWrapper();
    const caret = queryCaret();
    const spinner = querySpinner();

    expect(leading?.getAttribute('data-empty')).toBe('true');
    expect(trailing?.getAttribute('data-empty')).toBe('true');
    expect(label?.getAttribute('data-empty')).toBeNull();
    expect(caret).toBeNull();
    expect(spinner).toBeNull();
  });

  it('applies variant, size, and type inputs', () => {
    hostComponent.variant = 'secondary';
    hostComponent.size = 'lg';
    hostComponent.type = 'submit';
    fixture.detectChanges();

    const button = queryButton();
    expect(button.dataset.variant).toBe('secondary');
    expect(button.dataset.size).toBe('lg');
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('syncs boolean inputs with data attributes', async () => {
    hostComponent.fullWidth = true;
    hostComponent.dropdown = true;
    hostComponent.loading = true;
    hostComponent.iconOnly = true;
    hostComponent.disabled = true;
    await flushChanges();

    const button = queryButton();
    expect(button.dataset.fullWidth).toBe('true');
    expect(button.dataset.dropdown).toBe('true');
    expect(button.dataset.loading).toBe('true');
    expect(button.dataset.iconOnly).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(queryCaret()).not.toBeNull();
    expect(querySpinner()).not.toBeNull();

    hostComponent.iconOnly = false;
    hostComponent.loading = false;
    hostComponent.dropdown = false;
    await flushChanges();

    expect(button.dataset.iconOnly).toBeUndefined();
    expect(button.dataset.loading).toBeUndefined();
    expect(button.dataset.dropdown).toBeUndefined();
    expect(button.getAttribute('aria-busy')).toBeNull();
    expect(button.getAttribute('aria-haspopup')).toBeNull();
    expect(queryCaret()).toBeNull();
    expect(querySpinner()).toBeNull();
  });

  it('respects hasLabel overrides and MutationObserver updates', async () => {
    const button = queryButton();
    const label = queryLabelWrapper();
    expect(button.dataset.hasLabel).toBe('true');
    expect(label?.getAttribute('data-empty')).toBeNull();

    hostComponent.labelText = '   ';
    await flushChanges();

    expect(button.dataset.hasLabel).toBe('false');
    expect(queryLabelWrapper()?.getAttribute('data-empty')).toBe('true');

    hostComponent.labelText = 'Submit';
    await flushChanges();

    expect(button.dataset.hasLabel).toBe('true');
    expect(queryLabelWrapper()?.getAttribute('data-empty')).toBeNull();

    hostComponent.showLabel = false;
    await flushChanges();

    expect(button.dataset.hasLabel).toBe('false');
    expect(queryLabelWrapper()?.getAttribute('data-empty')).toBe('true');

    hostComponent.hasLabel = true;
    await flushChanges();

    expect(button.dataset.hasLabel).toBe('true');
    expect(queryLabelWrapper()?.getAttribute('data-empty')).toBeNull();

    hostComponent.hasLabel = null;
    await flushChanges();

    expect(button.dataset.hasLabel).toBe('false');
  });

  it('toggles icon wrappers when projecting content via directives', async () => {
    hostComponent.useLeadingDirective = true;
    hostComponent.useTrailingDirective = true;
    await flushChanges();

    expect(queryLeadingWrapper()?.getAttribute('data-empty')).toBeNull();
    expect(queryTrailingWrapper()?.getAttribute('data-empty')).toBeNull();

    hostComponent.useLeadingDirective = false;
    hostComponent.useTrailingDirective = false;
    await flushChanges();

    expect(queryLeadingWrapper()?.getAttribute('data-empty')).toBe('true');
    expect(queryTrailingWrapper()?.getAttribute('data-empty')).toBe('true');
  });

  it('projects template inputs for icons', async () => {
    hostComponent.useLeadingTemplate = true;
    hostComponent.useTrailingTemplate = true;
    await flushChanges();

    expect(queryLeadingWrapper()?.querySelector('.template-leading')).toBeTruthy();
    expect(queryTrailingWrapper()?.querySelector('.template-trailing')).toBeTruthy();
    expect(queryLeadingWrapper()?.getAttribute('data-empty')).toBeNull();
    expect(queryTrailingWrapper()?.getAttribute('data-empty')).toBeNull();
  });

  it('falls back to aria-haspopup="menu" and forwards aria-expanded overrides', async () => {
    hostComponent.dropdown = true;
    await flushChanges();

    const button = queryButton();
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBeNull();

    hostComponent.ariaHaspopup = 'listbox';
    hostComponent.ariaExpanded = true;
    await flushChanges();

    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('true');

    hostComponent.ariaHaspopup = null;
    hostComponent.ariaExpanded = undefined;
    await flushChanges();

    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBeNull();
  });

  it('forwards host inline styles to the internal button', async () => {
    const hostElement = fixture.nativeElement.querySelector('fivra-button') as HTMLElement;
    const button = queryButton();

    hostElement.style.setProperty('--fivra-button-accent', 'rgb(12, 244, 33)');

    await flushChanges();

    const computed = getComputedStyle(button);
    expect(computed.getPropertyValue('--fivra-button-accent').trim()).toBe('rgb(12, 244, 33)');
  });

  it('renders label input when no projected label is provided', async () => {
    hostComponent.showLabel = false;
    hostComponent.label = 'Continue';
    await flushChanges();

    const button = queryButton();
    expect(button.textContent).toContain('Continue');
  });

  it('applies semantic color aliases via the color input', async () => {
    hostComponent.variant = 'secondary';
    hostComponent.color = 'primary-success';
    hostComponent.showLabel = false;
    hostComponent.label = 'Continue';
    await flushChanges();

    const button = queryButton();
    const computed = getComputedStyle(button);
    expect(computed.getPropertyValue('--fivra-button-accent').trim()).toBe('var(--textPrimarySuccess)');
  });

  it('supports aria-label attributes and focus/click helpers', async () => {
    const button = queryButton();
    const clickSpy = vi.fn();
    button.addEventListener('click', clickSpy);

    hostComponent.ariaLabel = 'Submit form';
    hostComponent.ariaLabelledby = 'label-id';
    await flushChanges();

    expect(button.getAttribute('aria-label')).toBe('Submit form');
    expect(button.getAttribute('aria-labelledby')).toBe('label-id');

    const buttonInstance = hostComponent.buttonComponent;
    buttonInstance.focus();
    expect(document.activeElement).toBe(button);

    buttonInstance.click();
    expect(clickSpy).toHaveBeenCalled();
  });
});
