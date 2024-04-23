import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import * as UserActions from './state-user.actions';
import { User } from './state-user.models';

export const userFeatureKey = 'user';

export interface State extends EntityState<User> {
  loaded: boolean;
  loading: number;
  error?: any;
  selectedUser?: User;
};

export interface UserPartialState {
  readonly [userFeatureKey]: State;
};

export const userAdapter: EntityAdapter<User> =
  createEntityAdapter<User>({
    selectId: (user) => user.id,
  });

export const initialState: State = userAdapter.getInitialState({
  loaded: false,
  loading: 0,
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.init, (state) => ({
    ...state,
    loaded: false,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(UserActions.initSuccess, (state, { users }) =>
    userAdapter.setAll(
      users,
      {
        ...state,
        loading: state.loading - 1,
      }
    ) 
  ),
  on(UserActions.initFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
    selectedUser: undefined,
  })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    loading: state.loading - 1,
    selectedUser: user
  })),
  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    loading: state.loading - 1,
    selectedUser: user
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
)