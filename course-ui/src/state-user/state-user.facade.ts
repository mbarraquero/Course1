import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as UserActions from './state-user.actions';
import {
  LikesPredicate,
  Message,
  MessagesContainer,
  Photo,
  User,
  UsersFilters,
  UserUpdate
} from './state-user.models';
import * as UserSelectors from './state-user.selectors';

@Injectable()
export class StateUserFacade {
  loaded$ = this.store.pipe(select(UserSelectors.getLoaded));
  loading$ = this.store.pipe(select(UserSelectors.getLoading));
  error$ = this.store.pipe(select(UserSelectors.getError));
  pagination$ = this.store.pipe(select(UserSelectors.getPagination));
  filters$ = this.store.pipe(select(UserSelectors.getFilters));
  likesPagination$ = this.store.pipe(select(UserSelectors.getLikesPagination));
  likesUsers$ = this.store.pipe(select(UserSelectors.getLikesUsers));
  messagesPagination$ = this.store.pipe(select(UserSelectors.getMessagesPagination));
  messages$ = this.store.pipe(select(UserSelectors.getMessages));
  allUsers$ = this.store.pipe(select(UserSelectors.getAllUsers));
  selectedUser$ = this.store.pipe(select(UserSelectors.getSelectedUser));

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(UserActions.init());
  }

  goToUserPage(pageNumber: number) {
    this.store.dispatch(UserActions.goToUsersPage({ pageNumber }));
  }

  setFilters(filters: UsersFilters) {
    this.store.dispatch(UserActions.setFilters({ filters }));
  }

  resetFilters() {
    this.store.dispatch(UserActions.resetFilters());
  }

  like(user: User) {
    this.store.dispatch(UserActions.like({ user }));
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

  loadUserLikes(predicate: LikesPredicate) {
    this.store.dispatch(UserActions.loadUserLikes({ predicate }));
  }

  goToUserLikesPage(pageNumber: number, predicate: LikesPredicate) {
    this.store.dispatch(UserActions.goToUserLikesPage({ pageNumber, predicate }));
  }

  loadUserMessages(container: MessagesContainer) {
    this.store.dispatch(UserActions.loadUserMessages({ container }));
  }

  goToUserMessagesPage(pageNumber: number, container: MessagesContainer) {
    this.store.dispatch(UserActions.goToUserMessagesPage({ pageNumber, container }));
  }

  loadUserMessagesThread(userName: string) {
    this.store.dispatch(UserActions.loadUserMessagesThread({ userName }));
  }

  sendMessage(userName: string, message: string) {
    this.store.dispatch(UserActions.sendMessage({ userName, message }));
  }

  deleteMesage(message: Message) {
    this.store.dispatch(UserActions.deleteMesage({ message }));
  }
}