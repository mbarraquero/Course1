import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';

import { ErrorService } from 'src/error';
import { StateUserModule } from 'src/state-user';
import { UserSessionModule } from 'src/user-session';
import { UtilLoaderComponent } from 'src/util-loader';

import { AppComponent } from './app.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AppRoutingModule } from './routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginModalComponent,
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }), // disable for prod
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    StateUserModule,
    UserSessionModule,
    UtilLoaderComponent,
    AppRoutingModule,
  ],
  providers: [ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
