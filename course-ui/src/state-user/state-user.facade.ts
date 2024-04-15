import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UserActions from './state-user.actions';
import * as UserSelectors from './state-user.selectors';

@Injectable()
export class StateUserFacade {
  loaded$ = this.store.pipe(select(UserSelectors.getLoaded));
  loading$ = this.store.pipe(select(UserSelectors.getLoading));
  error$ = this.store.pipe(select(UserSelectors.getError));
  allUsers$ = this.store.pipe(select(UserSelectors.getAllUsers));

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(UserActions.init());
  }
}