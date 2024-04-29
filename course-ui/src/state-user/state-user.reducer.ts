import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Pagination } from 'src/pagination';

import * as UserActions from './state-user.actions';
import { User, UserOrderBy, UsersFilters } from './state-user.models';

export const userFeatureKey = 'user';

export const defaultPagination = {
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  totalPages: 0,
};
export const getDefaultGender = (gender: string) => gender === 'male' ? 'female' : 'male'; // not fully compliant with 2018, I know...
export const defaultMinAge = 18;
export const defaultMaxAge = 99;
export const defaultOrderBy = 'lastActive' as UserOrderBy;

export interface State extends EntityState<User> {
  loaded: boolean;
  loading: number;
  error?: any;
  pagination: Pagination;
  filters: UsersFilters;
  defaultFilters?: UsersFilters;
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
  pagination: defaultPagination,
  filters: {},
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.init, (state) => ({
    ...state,
    loaded: false,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(UserActions.goToUsersPage, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(UserActions.setFilters, (state, { filters }) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
    filters,
  })),
  on(UserActions.resetFilters, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
    filters: state.defaultFilters ?? {},
  })),
  on(UserActions.setDefaultFilters, (state, { defaultFilters }) => ({
    ...state,
    filters: defaultFilters,
    defaultFilters,
  })),
  on(UserActions.loadPagedUsersSuccess, (state, { users, pagination }) =>
    userAdapter.setAll(
      users,
      {
        ...state,
        loaded: true,
        loading: state.loading - 1,
        pagination
      }
    ) 
  ),
  on(UserActions.loadPagedUsersFailure, (state, { error }) => ({
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
  on(UserActions.photoAdded, (state, { photo }) => ({
    ...state,
    selectedUser: state.selectedUser
      ? {
        ...state.selectedUser,
        photos: [
          ...state.selectedUser.photos,
          photo
        ],
      }
      : undefined
  })),
  on(UserActions.setMainPhoto, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(UserActions.setMainPhotoSuccess, (state, { photoUrl, photos }) => ({
    ...state,
    loading: state.loading - 1,
    selectedUser: state.selectedUser
      ? {
        ...state.selectedUser,
        photoUrl,
        photos,
      }
      : undefined,
  })),
  on(UserActions.setMainPhotoFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
  on(UserActions.deletePhoto, (state) => ({
    ...state,
    loading: state.loading + 1,
    error: undefined,
  })),
  on(UserActions.deletePhotoSuccess, (state, { photos }) => ({
    ...state,
    loading: state.loading - 1,
    selectedUser: state.selectedUser
      ? {
        ...state.selectedUser,
        photos,
      }
      : undefined,
  })),
  on(UserActions.deletePhotoFailure, (state, { error }) => ({
    ...state,
    loading: state.loading - 1,
    error,
  })),
)