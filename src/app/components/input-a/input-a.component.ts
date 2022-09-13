import { Component, ContentChild, ElementRef, forwardRef, Input, OnInit, Provider, TemplateRef } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormBuilder, FormControl, FormControlName, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

const COUNTRY_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputAComponent),
  multi: true,
};
@Component({
  selector: 'input-a',
  templateUrl: './input-a.component.html',
  styleUrls: ['./input-a.component.scss'],
  providers: [
    COUNTRY_CONTROL_VALUE_ACCESSOR
  ]
})



export class InputAComponent implements  ControlValueAccessor {

  @Input() placeholder: string = ''
  @Input() label: string = '';

  @ContentChild('error')
  error!: TemplateRef<any>;

  private _value: any;

  constructor(
  ) {

  }

  public get value(): string {

    return this._value;
  }
  public set value(newValue) {

    this._value = newValue;
    this.onChangeCallback(this._value);
  }
  public onInputBlur() {
    this.onTouchedCallback();
  }

  private onChangeCallback = (x: any) => {};
  private onTouchedCallback = () => {};

  writeValue(obj: any): void {
    this._value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }
}
