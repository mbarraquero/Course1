import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { UtilLoaderComponent } from 'src/util-loader';
import { UtilMemberCardComponent } from 'src/util-member-card';

import { ViewListsComponent } from './view-lists.component';

@NgModule({
  declarations: [
    ViewListsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: ViewListsComponent,
    }]),
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    UtilLoaderComponent,
    UtilMemberCardComponent,
  ],
})
export class ViewListsModule { }
