import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State, userAdapter, userFeatureKey } from './state-user.reducer';

export const getUserState = createFeatureSelector<State>(userFeatureKey);
const { selectAll } = userAdapter.getSelectors();

export const getLoaded = createSelector(getUserState, (state) => state.loaded);
export const getLoading = createSelector(getUserState, (state) => state.loading > 0);
export const getError = createSelector(getUserState, (state) => state.error);
export const getAllUsers = createSelector(getUserState, (state) => selectAll(state));
export const getSelectedUser = createSelector(getUserState, (state) => state.selectedUser);