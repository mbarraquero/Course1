import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { MessageHubService, PresenceHubService } from 'src/hub';
import { PaginationService } from 'src/pagination';

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
    MessageHubService,
    PresenceHubService,
    PaginationService,
    HttpUserService,
    StateUserFacade,
  ]
})
export class StateUserModule {}