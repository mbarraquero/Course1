import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import * as AdminActions from './state-admin.actions';
import { UserWithRole } from './state-admin.models';

export const adminFeatureKey = 'admin';

export interface State extends EntityState<UserWithRole> {
  loaded: boolean;
  loading: number;
  error?: any;
};

export interface AdminPartialState {
  readonly [adminFeatureKey]: State;
};

export const adminAdapter: EntityAdapter<UserWithRole> =
  createEntityAdapter<UserWithRole>({
    selectId: (user) => user.id,
  });

export const initialState: State = adminAdapter.getInitialState({
  loaded: false,
  loading: 0,
});

export const adminReducer = createReducer(
  initialState,
  on(AdminActions.init, (state) => ({
    ...state,
    loaded: false,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(AdminActions.loadUsersWithRoleSuccess, (state, { users }) =>
    adminAdapter.setAll(
      users,
      {
        ...state,
        loaded: true,
        loading: state.loading - 1,
      }
    ) 
  ),
  on(AdminActions.loadUsersWithRoleFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
  on(AdminActions.updateUserRoles, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(AdminActions.updateUserRolesSuccess, (state, { user }) =>
    adminAdapter.updateOne(
      {
        id: user.id,
        changes: {
          roles: user.roles
        }
      },
      {
        ...state,
        loading: state.loading - 1,
      }
    ) 
  ),
  on(AdminActions.updateUserRolesFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
)