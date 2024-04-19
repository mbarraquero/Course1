import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MembersDetailsComponent } from './members-details/members-details.component';
import { MembersListComponent } from './members-list/members-list.component';
import { ViewMembersComponent } from './view-members.component';

const routes: Routes = [
  {
    path: '',
    component: MembersListComponent,
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: MembersDetailsComponent,
  }
];

@NgModule({
  declarations: [
    ViewMembersComponent,
    MembersListComponent,
    MembersDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ViewMembersModule { }
