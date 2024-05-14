import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import * as AdminActions from './state-admin.actions';
import { PhotoForApproval, UserWithRole } from './state-admin.models';

export const adminFeatureKey = 'admin';

export interface State extends EntityState<UserWithRole> {
  loaded: boolean;
  loading: number;
  error?: any;
  photosToModerate?: PhotoForApproval[],
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
  on(AdminActions.loadPhotosToModerate, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
    photosToModerate: undefined,
  })),
  on(AdminActions.loadPhotosToModerateSuccess, (state, { photosToModerate }) => ({
    ...state,
    loading: state.loading - 1,
    photosToModerate,
  })),
  on(AdminActions.loadPhotosToModerateFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
  on(AdminActions.approvePhotoToModerate, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(AdminActions.approvePhotoToModerateSuccess, (state, { photosToModerate }) => ({
    ...state,
    loading: state.loading - 1,
    photosToModerate,
  })),
  on(AdminActions.approvePhotoToModerateFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
  on(AdminActions.rejectPhotoToModerate, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(AdminActions.rejectPhotoToModerateSuccess, (state, { photosToModerate }) => ({
    ...state,
    loading: state.loading - 1,
    photosToModerate,
  })),
  on(AdminActions.rejectPhotoToModerateFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
)