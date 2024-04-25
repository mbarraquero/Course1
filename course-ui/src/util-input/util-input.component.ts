import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-util-input',
  templateUrl: './util-input.component.html',
  styleUrls: ['./util-input.component.scss']
})
export class UtilInputComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() validations: { error: string; message: string }[] = [];

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  constructor(
    @Self() private readonly ngControl: NgControl
  ) {
    this.ngControl.valueAccessor = this;
  }

  writeValue() {
  }
  registerOnChange() {
  }
  registerOnTouched() {
  }
}
