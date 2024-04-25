import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilDatePickerModule } from 'src/util-date-picker';
import { UtilInputModule } from 'src/util-input';

import { ViewHomePageComponent } from './view-home-page.component';

@NgModule({
  declarations: [
    ViewHomePageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: ViewHomePageComponent,
    }]),
    UtilDatePickerModule,
    UtilInputModule,
  ],
})
export class ViewHomePageModule { }
