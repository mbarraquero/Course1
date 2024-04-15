import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { HttpUserService } from './api/http-user.service';

import { UserEffects } from './state-user.effects';
import { StateUserFacade } from './state-user.facade';
import { userFeatureKey, userReducer } from './state-user.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(userFeatureKey, userReducer),
    EffectsModule.forFeature([UserEffects]),
  ],
  providers: [
    HttpUserService,
    StateUserFacade,
  ]
})
export class StateUserModule {}