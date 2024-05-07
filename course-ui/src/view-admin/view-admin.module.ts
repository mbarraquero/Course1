import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { UserSessionModule, UserSessionService } from 'src/user-session';
import { UtilLoaderComponent } from 'src/util-loader';

import { PhotoManagementComponent } from './photo-management/photo-management.component';
import { StateAdminModule } from './state-admin';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRolesModalComponent } from './user-roles-modal/user-roles-modal.component';
import { ViewAdminComponent } from './view-admin.component';

@NgModule({
  declarations: [
    PhotoManagementComponent,
    UserManagementComponent,
    UserRolesModalComponent,
    ViewAdminComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
      path: '',
      component: ViewAdminComponent,
    }]),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    UserSessionModule,
    UtilLoaderComponent,
    StateAdminModule,
  ],
  providers: [
    UserSessionService,
  ]
})
export class ViewAdminModule { }
