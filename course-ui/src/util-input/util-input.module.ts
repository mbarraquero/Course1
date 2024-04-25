import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilInputComponent } from './util-input.component';

@NgModule({
  declarations: [
    UtilInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    UtilInputComponent,
  ]
})
export class UtilInputModule { }
