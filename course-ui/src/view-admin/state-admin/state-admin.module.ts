import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { HttpUserService } from './api/http-admin.service';

import { AdminEffects } from './state-admin.effects';
import { StateAdminFacade } from './state-admin.facade';
import { adminFeatureKey, adminReducer } from './state-admin.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(adminFeatureKey, adminReducer),
    EffectsModule.forFeature([AdminEffects]),
  ],
  providers: [
    HttpUserService,
    StateAdminFacade,
  ]
})
export class StateAdminModule {}