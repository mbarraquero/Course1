import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';

import { UtilLoaderComponent } from 'src/util-loader';

import { ViewMessagesComponent } from './view-messages.component';

@NgModule({
  declarations: [
    ViewMessagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: ViewMessagesComponent,
    }]),
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    TimeagoModule.forRoot(),
    UtilLoaderComponent,
  ]
})
export class ViewMessagesModule { }
