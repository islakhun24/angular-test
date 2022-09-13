import { DecimalPipe } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective implements OnInit, OnDestroy {
  private debounceTimer: any;
  private decimalPipe = new DecimalPipe('id-ID');
  private subscription: Subscription[] = [];
  private value: number = 0;

  @Input()
  public allowComma: boolean | undefined;

  @Input()
  public allowOperator: boolean | undefined;

  @Input()
  public isFormatThousand: boolean | undefined;

  @Input()
  public isFormatThousandRupiah: boolean | undefined;

  @Input()
  public limitComma: number | undefined;

  @Input()
  public allowLeadingZero = false;

  @Input()
  public minNumber: number | undefined;

  @Input()
  public maxNumber: number | undefined;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = event.key;
    const numberRegex = /[0-9]+/g;
    const operatorKeys = ['+', '-', '*', '/', '(', ')'];
    const specialKeys = [
      'ArrowLeft',
      'ArrowRight',
      'Backspace',
      'Del',
      'Delete',
      'Enter',
      'Escape',
      'End',
      'Home',
      'Tab',
    ];
    const { value } = this.elementRef.nativeElement;

    if (this.isFormatThousand || this.isFormatThousandRupiah) {
      if (value === '0' && event.key === '0') {
        event.preventDefault();
      }
    }

    /* allow Select All, Copy, Paste, Cut */

    const n65 = 65;
    const n67 = 67;
    const n86 = 86;
    const n88 = 88;
    if (
      (event.keyCode === n65 && event.ctrlKey === true) /* Ctrl + A */ ||
      (event.keyCode === n67 && event.ctrlKey === true) /* Ctrl + C */ ||
      (event.keyCode === n86 && event.ctrlKey === true) /* Ctrl + V */ ||
      (event.keyCode === n88 && event.ctrlKey === true) /* Ctrl + X */ ||
      (event.keyCode === n65 && event.metaKey === true) /* Cmd + A */ ||
      (event.keyCode === n67 && event.metaKey === true) /* Cmd + C */ ||
      (event.keyCode === n86 && event.metaKey === true) /* Cmd + V */ ||
      (event.keyCode === n88 && event.metaKey === true) /* Cmd + X */
    ) {
      return;
    }

    /* allow Special Key */

    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    /* allow comma */

    if (this.allowComma) {
      if (this.limitComma !== undefined && numberRegex.test(input)) {
        const current = this.elementRef.nativeElement.value;
        const position = this.elementRef.nativeElement.selectionStart;
        const next = [
          current.slice(0, position),
          event.key === 'Decimal' ? '.' : event.key,
          current.slice(position),
        ].join('');
        const afterComma = next.split('.')[1];

        if (afterComma && afterComma?.length > this.limitComma) {
          event.preventDefault();
        }

        return;
      }

      if (event.key === '.' && !/\./g.test(value)) {
        return;
      }
    }

    /* allow operator */

    if (this.allowOperator) {
      if (operatorKeys.indexOf(event.key) !== -1) {
        return;
      }
    }

    /* allow number */

    if (numberRegex.test(input)) {
      return;
    }

    event.preventDefault();
  }

  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent): void {
    const { value } = this.elementRef.nativeElement;

    /* allow arrow keys */
    const arrowKeys = ['ArrowLeft', 'ArrowRight'];

    if (arrowKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (value?.length < 1) {
      return;
    }

    if (this.isFormatThousandRupiah) {
      const nominalWithoutDelimiter = this.parse(value);

      const nominalWithDelimiter = this.isFormatThousandRupiah
        ? this.transform(Number(nominalWithoutDelimiter))
        : this.decimalPipe.transform(Number(nominalWithoutDelimiter), '0.0');

      this.ngControl.control?.setValue(nominalWithoutDelimiter);

      if (Number(nominalWithoutDelimiter) > 0) {
        this.ngControl.valueAccessor?.writeValue(nominalWithDelimiter);
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(/\D/g, '');

    document.execCommand('insertText', false, pastedInput);
  }

  constructor(
    @Self()
    private ngControl: NgControl,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.subscription = [];

    this.setValueChanges();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((each) => each.unsubscribe());
  }

  public transform(value: number): string {
    value = value && value > 0 ? value : 0;

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  public parse(value: string): string {
    return value
      .toString()
      .split('.')
      .join('')
      .split(',')
      .join('')
      .split(' ')
      .join('')
      .replace('R', '')
      .replace('p', '');
  }

  private setValueChanges(): void {
    /* subs value changes to check limit */

    const subs = this.ngControl.valueChanges?.subscribe((value) => {
      this.value = Number(value);

      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.checkLimit();
      }, 100);
    });

    if (subs instanceof Subscription) {
      this.subscription.push(subs);
    }
  }

  private checkLimit(): void {
    /* check limit if defined */
    if (this.value.toString()?.length > 1) {
      if (this.minNumber !== undefined && this.value < Number(this.minNumber)) {
        this.ngControl.control?.setValue(Number(this.minNumber));
      }

      if (this.maxNumber !== undefined && this.value > Number(this.maxNumber)) {
        this.ngControl.control?.setValue(Number(this.maxNumber));
      }
    }
  }
}
