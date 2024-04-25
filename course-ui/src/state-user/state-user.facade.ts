import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UserActions from './state-user.actions';
import { Photo, UserUpdate } from './state-user.models';
import * as UserSelectors from './state-user.selectors';

@Injectable()
export class StateUserFacade {
  loaded$ = this.store.pipe(select(UserSelectors.getLoaded));
  loading$ = this.store.pipe(select(UserSelectors.getLoading));
  error$ = this.store.pipe(select(UserSelectors.getError));
  allUsers$ = this.store.pipe(select(UserSelectors.getAllUsers));
  selectedUser$ = this.store.pipe(select(UserSelectors.getSelectedUser));

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(UserActions.init());
  }

  loadUser(userName: string) {
    this.store.dispatch(UserActions.loadUser({ userName }));
  }

  updateUser(userUpdate: UserUpdate) {
    this.store.dispatch(UserActions.updateUser({ userUpdate }));
  }

  photoAdded(photo: Photo) {
    this.store.dispatch(UserActions.photoAdded({ photo }));
  }

  setMainPhoto(photo: Photo) {
    this.store.dispatch(UserActions.setMainPhoto({ photo }));
  }

  deletePhoto(photo: Photo) {
    this.store.dispatch(UserActions.deletePhoto({ photo }));
  }
}