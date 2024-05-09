import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { PresenceHubService } from 'src/hub';

import { HttpUserSessionService } from './http-user-session.service';
import { LocalStorageService } from './local-storage.service';
import { UserSessionInterceptor } from './user-session.interceptor';
import { UserSessionService } from './user-session.service';
import { ForRolesDirective } from './for-roles.directive';

@NgModule({
  declarations: [
    ForRolesDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    PresenceHubService,
    HttpUserSessionService,
    LocalStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserSessionInterceptor,
      multi: true,
    },
    UserSessionService,
  ],
  exports: [
    ForRolesDirective,
  ]
})
export class UserSessionModule { }
