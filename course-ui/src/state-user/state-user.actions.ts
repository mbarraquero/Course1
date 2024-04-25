import { createAction, props } from '@ngrx/store';

import { Photo, User, UserUpdate } from './state-user.models';

function prependLabel(actionName: string, type?: 'api' | 'page') {
  const typeLabel = type === 'api' ? '/API' : !!type ? '/Page' : '';
  return `[User${typeLabel}] ${actionName}`;
}

export const init = createAction(prependLabel('Init', 'page'));
export const initSuccess = createAction(
  prependLabel('Init Success', 'api'),
  props<{ users: User[] }>()
);
export const initFailure = createAction(
  prependLabel('Init Failure', 'api'),
  props<{ error: any }>()
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
  props<{ error: any }>()
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
  props<{ error: any }>()
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
  props<{ error: any }>()
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
  props<{ error: any }>()
);