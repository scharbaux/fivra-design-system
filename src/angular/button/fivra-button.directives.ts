import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[fivraButtonLeadingIcon]',
  standalone: true,
})
export class FivraButtonLeadingIconDirective {
  public readonly elementRef = inject(ElementRef<HTMLElement>);
}

@Directive({
  selector: '[fivraButtonTrailingIcon]',
  standalone: true,
})
export class FivraButtonTrailingIconDirective {
  public readonly elementRef = inject(ElementRef<HTMLElement>);
}
