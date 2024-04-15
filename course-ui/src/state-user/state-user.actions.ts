import { createAction, props } from '@ngrx/store';

import { User } from './state-user.models';

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