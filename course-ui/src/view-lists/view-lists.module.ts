import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ViewListsComponent } from './view-lists.component';

@NgModule({
  declarations: [
    ViewListsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: ViewListsComponent,
    }])
  ],
})
export class ViewListsModule { }
