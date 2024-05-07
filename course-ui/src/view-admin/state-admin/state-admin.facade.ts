import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as AdminActions from './state-admin.actions';
import { UserWithRole } from './state-admin.models';
import * as AdminSelectors from './state-admin.selectors';

@Injectable()
export class StateAdminFacade {
  loaded$ = this.store.pipe(select(AdminSelectors.getLoaded));
  loading$ = this.store.pipe(select(AdminSelectors.getLoading));
  error$ = this.store.pipe(select(AdminSelectors.getError));
  allUsers$ = this.store.pipe(select(AdminSelectors.getAllUsers));

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(AdminActions.init());
  }

  updateUserRoles(user: UserWithRole) {
    this.store.dispatch(AdminActions.updateUserRoles({ user }));
  }
}