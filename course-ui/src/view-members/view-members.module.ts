import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from "ngx-timeago";

import { UtilGalleryComponent } from 'src/util-gallery';
import { UtilLoaderComponent } from 'src/util-loader';
import { UtilMemberCardComponent } from 'src/util-member-card';

import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { MembersDetailsComponent } from './members-details/members-details.component';
import { MembersEditComponent } from './members-edit/members-edit.component';
import { MembersListComponent } from './members-list/members-list.component';
import { ViewMembersComponent } from './view-members.component';

const routes: Routes = [
  {
    path: '',
    component: ViewMembersComponent,
    children: [
      {
        path: '',
        component: MembersListComponent,
        pathMatch: 'full'
      },
      {
        path: 'edit',
        canDeactivate: [unsavedChangesGuard],
        component: MembersEditComponent,
      },
      {
        path: ':username',
        component: MembersDetailsComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [
    ViewMembersComponent,
    MembersDetailsComponent,
    MembersEditComponent,
    MembersListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    TimeagoModule.forRoot(),
    UtilGalleryComponent,
    UtilLoaderComponent,
    UtilMemberCardComponent,
  ]
})
export class ViewMembersModule { }
