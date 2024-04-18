import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { HttpUserSessionService } from './http-user-session.service';
import { LocalStorageService } from './local-storage.service';
import { UserSessionInterceptor } from './user-session.interceptor';
import { UserSessionService } from './user-session.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    HttpUserSessionService,
    LocalStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserSessionInterceptor,
      multi: true,
    },
    UserSessionService,
  ]
})
export class UserSessionModule { }