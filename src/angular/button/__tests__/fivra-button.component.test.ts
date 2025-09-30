import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import {
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
} from '@components/Button/button.styles';

import { FivraButtonModule, FivraButtonComponent } from '../../public-api';

@Component({
  template: `
    <ng-template #leadingIconTpl>Leading Icon</ng-template>
    <ng-template #trailingIconTpl>Trailing Icon</ng-template>

    <fivra-button
      [variant]="variant"
      [size]="size"
      [fullWidth]="fullWidth"
      [iconOnly]="iconOnly"
      [hasLabel]="hasLabel"
      [dropdown]="dropdown"
      [loading]="loading"
      [type]="type"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      [ariaLabelledby]="ariaLabelledby"
      [leadingIcon]="useLeadingTemplate ? leadingIconTpl : null"
      [trailingIcon]="useTrailingTemplate ? trailingIconTpl : null"
    >
      <span *ngIf="showLabel">{{ labelText }}</span>
      <span *ngIf="projectLeadingDirective" fivraButtonLeadingIcon>Leading Slot</span>
      <span *ngIf="projectTrailingDirective" fivraButtonTrailingIcon>Trailing Slot</span>
    </fivra-button>
  `,
})
class TestHostComponent {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth = false;
  iconOnly = false;
  hasLabel?: boolean;
  dropdown = false;
  loading = false;
  type: 'button' | 'submit' | 'reset' = 'button';
  disabled = false;
  ariaLabel: string | null = null;
  ariaLabelledby: string | null = null;
  showLabel = true;
  labelText = 'Submit';
  useLeadingTemplate = false;
  useTrailingTemplate = false;
  projectLeadingDirective = false;
  projectTrailingDirective = false;

  @ViewChild(FivraButtonComponent, { static: true })
  buttonComponent!: FivraButtonComponent;

  @ViewChild('leadingIconTpl', { static: true })
  leadingTemplate!: TemplateRef<unknown>;

  @ViewChild('trailingIconTpl', { static: true })
  trailingTemplate!: TemplateRef<unknown>;
}

function createFixture() {
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.detectChanges();
  return fixture;
}

async function flushMutationObservers() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [CommonModule, FivraButtonModule],
    declarations: [TestHostComponent],
  }).compileComponents();
});

describe('FivraButtonComponent', () => {
  it('renders default attributes', () => {
    const fixture = createFixture();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.dataset.variant).toBe(DEFAULT_BUTTON_VARIANT);
    expect(button.dataset.size).toBe(DEFAULT_BUTTON_SIZE);
    expect(button.dataset.fullWidth).toBeUndefined();
    expect(button.dataset.iconOnly).toBeUndefined();
    expect(button.dataset.dropdown).toBeUndefined();
    expect(button.dataset.loading).toBeUndefined();
    expect(button.dataset.hasLabel).toBe('true');
    expect(button.type).toBe('button');
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.getAttribute('aria-labelledby')).toBeNull();
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it('updates data attributes and ARIA state when inputs change', async () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    host.variant = 'secondary';
    host.size = 'lg';
    host.fullWidth = true;
    host.iconOnly = true;
    host.dropdown = true;
    host.loading = true;
    host.type = 'submit';
    host.disabled = true;
    host.ariaLabel = 'Proceed';
    host.ariaLabelledby = 'button-id';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.dataset.variant).toBe('secondary');
    expect(button.dataset.size).toBe('lg');
    expect(button.dataset.fullWidth).toBe('true');
    expect(button.dataset.iconOnly).toBe('true');
    expect(button.dataset.dropdown).toBe('true');
    expect(button.dataset.loading).toBe('true');
    expect(button.dataset.hasLabel).toBe('false');
    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Proceed');
    expect(button.getAttribute('aria-labelledby')).toBe('button-id');
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('resolves hasLabel automatically based on projected content', async () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const labelWrapper: HTMLElement = fixture.nativeElement.querySelector(`.${BUTTON_LABEL_CLASS}`);

    expect(button.dataset.hasLabel).toBe('true');
    expect(labelWrapper.getAttribute('data-empty')).toBe('false');

    host.showLabel = false;
    fixture.detectChanges();
    await flushMutationObservers();
    fixture.detectChanges();

    expect(button.dataset.hasLabel).toBe('false');
    expect(labelWrapper.getAttribute('data-empty')).toBe('true');

    host.hasLabel = true;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.dataset.hasLabel).toBe('true');
    expect(labelWrapper.getAttribute('data-empty')).toBe('false');

    host.hasLabel = false;
    host.showLabel = true;
    fixture.detectChanges();
    await flushMutationObservers();
    fixture.detectChanges();

    expect(button.dataset.hasLabel).toBe('false');
    expect(labelWrapper.getAttribute('data-empty')).toBe('true');
  });

  it('toggles leading and trailing icon wrappers for template inputs', async () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const leadingWrapper: HTMLElement = fixture.nativeElement.querySelector(`.${BUTTON_LEADING_ICON_CLASS}`);
    const trailingWrapper: HTMLElement = fixture.nativeElement.querySelector(`.${BUTTON_TRAILING_ICON_CLASS}`);

    expect(leadingWrapper.getAttribute('data-empty')).toBe('true');
    expect(trailingWrapper.getAttribute('data-empty')).toBe('true');

    host.useLeadingTemplate = true;
    host.useTrailingTemplate = true;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(leadingWrapper.getAttribute('data-empty')).toBe('false');
    expect(trailingWrapper.getAttribute('data-empty')).toBe('false');

    host.useLeadingTemplate = false;
    host.useTrailingTemplate = false;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(leadingWrapper.getAttribute('data-empty')).toBe('true');
    expect(trailingWrapper.getAttribute('data-empty')).toBe('true');
  });

  it('toggles icon wrappers when projecting directive content', async () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const leadingWrapper: HTMLElement = fixture.nativeElement.querySelector(`.${BUTTON_LEADING_ICON_CLASS}`);
    const trailingWrapper: HTMLElement = fixture.nativeElement.querySelector(`.${BUTTON_TRAILING_ICON_CLASS}`);

    host.projectLeadingDirective = true;
    host.projectTrailingDirective = true;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(leadingWrapper.getAttribute('data-empty')).toBe('false');
    expect(trailingWrapper.getAttribute('data-empty')).toBe('false');

    host.projectLeadingDirective = false;
    host.projectTrailingDirective = false;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(leadingWrapper.getAttribute('data-empty')).toBe('true');
    expect(trailingWrapper.getAttribute('data-empty')).toBe('true');
  });

  it('exposes imperative focus and click helpers', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const buttonEl: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const clickSpy = vi.fn();

    buttonEl.addEventListener('click', clickSpy);

    host.buttonComponent.focus();
    expect(document.activeElement).toBe(buttonEl);

    host.buttonComponent.click();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('renders the spinner wrapper and reflects loading state', async () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const spinner: HTMLElement = fixture.nativeElement.querySelector(`.${BUTTON_SPINNER_CLASS}`);

    expect(spinner).toBeTruthy();
    expect(button.dataset.loading).toBeUndefined();

    host.loading = true;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.dataset.loading).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
  });
});
