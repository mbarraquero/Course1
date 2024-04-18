import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  ],
})
export class ViewHomePageModule { }
