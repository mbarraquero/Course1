import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { UtilGalleryComponent } from 'src/util-gallery';

import { MembersDetailsComponent } from './members-details/members-details.component';
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
        path: ':username',
        component: MembersDetailsComponent,
      }
    ]
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
    TabsModule.forRoot(),
    UtilGalleryComponent,
  ]
})
export class ViewMembersModule { }
