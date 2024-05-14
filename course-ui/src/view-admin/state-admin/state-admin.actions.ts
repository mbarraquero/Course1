import { createAction, props } from '@ngrx/store';

import { PhotoForApproval, UserWithRole } from './state-admin.models';

function prependLabel(actionName: string, type?: 'api' | 'page') {
  const typeLabel = type === 'api' ? '/API' : !!type ? '/Page' : '';
  return `[Admin${typeLabel}] ${actionName}`;
}

export const init = createAction(prependLabel('Init', 'page'));

export const loadUsersWithRole = createAction(prependLabel('Load Users With Roles'));
export const loadUsersWithRoleSuccess = createAction(
  prependLabel('Load Users With Roles Success', 'api'),
  props<{ users: UserWithRole[]; }>()
);
export const loadUsersWithRoleFailure = createAction(
  prependLabel('Load Users With Roles Failure', 'api'),
  props<{ error: any; }>()
);

export const updateUserRoles = createAction(
  prependLabel('Update User Roles', 'page'),
  props<{ user: UserWithRole; }>()
);
export const updateUserRolesSuccess = createAction(
  prependLabel('Update User Roles Success', 'api'),
  props<{ user: UserWithRole; }>()
);
export const updateUserRolesFailure = createAction(
  prependLabel('Update User Roles Failure', 'api'),
  props<{ error: any; }>()
);

export const loadPhotosToModerate = createAction(prependLabel('Load Photos To Moderate'));
export const loadPhotosToModerateSuccess = createAction(
  prependLabel('Load Photos To Moderate Success', 'api'),
  props<{ photosToModerate: PhotoForApproval[]; }>()
);
export const loadPhotosToModerateFailure = createAction(
  prependLabel('Load Photos To Moderate Failure', 'api'),
  props<{ error: any; }>()
);

export const approvePhotoToModerate = createAction(
  prependLabel('Approve Photo To Moderate', 'page'),
  props<{ photoToModerate: PhotoForApproval; }>()
);
export const approvePhotoToModerateSuccess = createAction(
  prependLabel('Approve Photo To Moderate Success', 'api'),
  props<{ photosToModerate: PhotoForApproval[]; }>()
);
export const approvePhotoToModerateFailure = createAction(
  prependLabel('Approve Photo To Moderate Failure', 'api'),
  props<{ error: any; }>()
);

export const rejectPhotoToModerate = createAction(
  prependLabel('Reject Photo To Moderate', 'page'),
  props<{ photoToModerate: PhotoForApproval; }>()
);
export const rejectPhotoToModerateSuccess = createAction(
  prependLabel('Reject Photo To Moderate Success', 'api'),
  props<{ photosToModerate: PhotoForApproval[]; }>()
);
export const rejectPhotoToModerateFailure = createAction(
  prependLabel('Reject Photo To Moderate Failure', 'api'),
  props<{ error: any; }>()
);