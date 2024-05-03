import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State, userAdapter, userFeatureKey } from './state-user.reducer';

export const getUserState = createFeatureSelector<State>(userFeatureKey);
const { selectAll/*, selectEntities*/ } = userAdapter.getSelectors();

export const getLoaded = createSelector(getUserState, (state) => state.loaded);
export const getLoading = createSelector(getUserState, (state) => state.loading > 0);
export const getError = createSelector(getUserState, (state) => state.error);
export const getPagination = createSelector(getUserState, (state) => state.pagination);
export const getFilters = createSelector(getUserState, (state) => state.filters);
export const getDefaultFilters = createSelector(getUserState, (state) => state.defaultFilters);
export const getLikesPagination = createSelector(getUserState, (state) => state.likesPagination);
export const getLikesUsers = createSelector(getUserState, (state) => state.likesUsers);
export const getMessagesPagination = createSelector(getUserState, (state) => state.messagesPagination);
export const getMessages = createSelector(getUserState, (state) => state.messages);
export const getAllUsers = createSelector(getUserState, (state) => selectAll(state));
export const getSelectedUser = createSelector(getUserState, (state) => state.selectedUser);
// export const getSelectedUser = createSelector(getUserState, (state) =>
//   state.selectedUserId ? selectEntities(state)[state.selectedUserId] : undefined
// );