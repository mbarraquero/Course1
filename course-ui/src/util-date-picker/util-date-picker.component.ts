import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-util-date-picker',
  templateUrl: './util-date-picker.component.html',
  styleUrls: ['./util-date-picker.component.scss']
})
export class UtilDatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() maxDate?: Date;
  @Input() validations: { error: string; message: string }[] = [];

  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD MMM YYYY',
    isAnimated: true,
  };

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
