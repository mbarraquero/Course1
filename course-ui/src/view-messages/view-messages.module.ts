import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ViewMessagesComponent } from './view-messages.component';

@NgModule({
  declarations: [
    ViewMessagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: ViewMessagesComponent,
    }]),
  ]
})
export class ViewMessagesModule { }
