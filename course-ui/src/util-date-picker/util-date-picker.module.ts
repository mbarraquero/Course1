import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { UtilDatePickerComponent } from './util-date-picker.component';

@NgModule({
  declarations: [
    UtilDatePickerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    UtilDatePickerComponent,
  ]
})
export class UtilDatePickerModule { }
