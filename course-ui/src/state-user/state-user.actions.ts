import { createAction, props } from '@ngrx/store';

import { Pagination } from 'src/pagination';

import { LikesPredicate, Message, MessagesContainer, Photo, User, UserUpdate, UsersFilters } from './state-user.models';

function prependLabel(actionName: string, type?: 'api' | 'page') {
  const typeLabel = type === 'api' ? '/API' : !!type ? '/Page' : '';
  return `[User${typeLabel}] ${actionName}`;
}

export const init = createAction(prependLabel('Init', 'page'));
export const goToUsersPage = createAction(
  prependLabel('Go To Users Page', 'page'),
  props<{ pageNumber: number; }>()
);
export const setFilters = createAction(
  prependLabel('Set Filters', 'page'),
  props<{ filters: UsersFilters }>()
);
export const resetFilters = createAction(prependLabel('Reset Filters', 'page'));
export const setDefaultFilters = createAction(
  prependLabel('Set Default Filters'),
  props<{ defaultFilters: UsersFilters }>()
);

export const loadPagedUsers = createAction(
  prependLabel('Load Paged Users'),
  props<{ pageNumber: number; pageSize: number; filters: UsersFilters; }>()
);
export const loadPagedUsersSuccess = createAction(
  prependLabel('Load Paged Users Success', 'api'),
  props<{ users: User[]; pagination: Pagination; }>()
);
export const loadPagedUsersFailure = createAction(
  prependLabel('Load Paged Users Failure', 'api'),
  props<{ error: any; }>()
);

export const loadUser = createAction(
  prependLabel('Load User', 'page'),
  props<{ userName: string }>()
);
export const loadUserSuccess = createAction(
  prependLabel('Load User Success', 'api'),
  props<{ user: User }>()
);
export const loadUserFailure = createAction(
  prependLabel('Load User Failure', 'api'),
  props<{ error: any; }>()
);

export const updateUser = createAction(
  prependLabel('Update User', 'page'),
  props<{ userUpdate: UserUpdate }>()
);
export const updateUserSuccess = createAction(
  prependLabel('Update User Success', 'api'),
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  prependLabel('Update User Failure', 'api'),
  props<{ error: any; }>()
);

export const photoAdded = createAction(
  prependLabel('Photo Added', 'page'),
  props<{ photo: Photo }>()
);

export const setMainPhoto = createAction(
  prependLabel('Set Main Photo', 'page'),
  props<{ photo: Photo }>()
);
export const setMainPhotoSuccess = createAction(
  prependLabel('Set Main Photo Success', 'api'),
  props<{ photoUrl: string; photos: Photo[] }>()
);
export const setMainPhotoFailure = createAction(
  prependLabel('Set Main Photo Failure', 'api'),
  props<{ error: any; }>()
);

export const deletePhoto = createAction(
  prependLabel('Delete Photo', 'page'),
  props<{ photo: Photo }>()
);
export const deletePhotoSuccess = createAction(
  prependLabel('Delete Photo Success', 'api'),
  props<{ photos: Photo[] }>()
);
export const deletePhotoFailure = createAction(
  prependLabel('Delete Photo Failure', 'api'),
  props<{ error: any; }>()
);

export const loadUserLikes = createAction(
  prependLabel('Load User Likes', 'page'),
  props<{ predicate: LikesPredicate; }>()
);
export const goToUserLikesPage = createAction(
  prependLabel('Go To User Likes Page', 'page'),
  props<{ pageNumber: number; predicate: LikesPredicate; }>()
);
export const loadPagedUserLikes = createAction(
  prependLabel('Load Paged User Likes'),
  props<{ pageNumber: number; pageSize: number; predicate: LikesPredicate; }>()
);
export const loadPagedUserLikesSuccess = createAction(
  prependLabel('Load Paged User Likes Success', 'api'),
  props<{ likesUsers?: User[]; likesPagination: Pagination; }>()
);
export const loadPagedUserLikesFailure = createAction(
  prependLabel('Load Paged User Likes Failure', 'api'),
  props<{ error: any; }>()
);

export const like = createAction(
  prependLabel('Like', 'page'),
  props<{ user: User }>()
);
export const likeSuccess = createAction(prependLabel('Like Success', 'api'));
export const likeFailure = createAction(
  prependLabel('Like Failure', 'api'),
  props<{ error: any; }>()
);
// TODO dislike

export const loadUserMessages = createAction(
  prependLabel('Load User Messages', 'page'),
  props<{ container: MessagesContainer; }>()
);
export const goToUserMessagesPage = createAction(
  prependLabel('Go To User Messages Page', 'page'),
  props<{ pageNumber: number; container: MessagesContainer; }>()
);
export const loadPagedUserMessages = createAction(
  prependLabel('Load Paged User Messages'),
  props<{ pageNumber: number; pageSize: number; container: MessagesContainer; }>()
);
export const loadPagedUserMessagesSuccess = createAction(
  prependLabel('Load Paged User Messages Success', 'api'),
  props<{ messages: Message[]; messagesPagination: Pagination; }>()
);
export const loadPagedUserMessagesFailure = createAction(
  prependLabel('Load Paged User Messages Failure', 'api'),
  props<{ error: any; }>()
);

export const loadUserMessagesThread = createAction(
  prependLabel('Load User Messages Thread', 'page'),
  props<{ userName: string; }>()
);
export const loadUserMessagesThreadSuccess = createAction(
  prependLabel('Load User Messages Thread Success', 'api'),
  props<{ messages: Message[]; }>()
);
export const loadUserMessagesThreadFailure = createAction(
  prependLabel('Load User Messages Thread Failure', 'api'),
  props<{ error: any; }>()
);

export const sendMessage = createAction(
  prependLabel('Send Message', 'page'),
  props<{ userName: string; message: string; }>()
);
export const sendMessageSuccess = createAction(
  prependLabel('Send Message Success', 'api'),
  props<{ messages: Message[]; }>()
);
export const sendMessageFailure = createAction(
  prependLabel('Send Message Failure', 'api'),
  props<{ error: any; }>()
);

export const deleteMesage = createAction(
  prependLabel('Delete Message', 'page'),
  props<{ message: Message; }>()
);
export const deleteMesageSuccess = createAction(
  prependLabel('Delete Message Success', 'api'),
  props<{ messages: Message[]; }>()
);
export const deleteMesageFailure = createAction(
  prependLabel('Delete Message Failure', 'api'),
  props<{ error: any; }>()
);
