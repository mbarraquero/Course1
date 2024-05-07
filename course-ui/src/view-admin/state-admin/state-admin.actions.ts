import { createAction, props } from '@ngrx/store';

import { UserWithRole } from './state-admin.models';

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