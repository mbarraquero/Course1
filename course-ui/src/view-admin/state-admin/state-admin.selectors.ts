import { createFeatureSelector, createSelector } from '@ngrx/store';

import { State, adminAdapter, adminFeatureKey } from './state-admin.reducer';

export const getAdminState = createFeatureSelector<State>(adminFeatureKey);
const { selectAll } = adminAdapter.getSelectors();

export const getLoaded = createSelector(getAdminState, (state) => state.loaded);
export const getLoading = createSelector(getAdminState, (state) => state.loading > 0);
export const getError = createSelector(getAdminState, (state) => state.error);
export const getPhotosToModerate = createSelector(getAdminState, (state) => state.photosToModerate);
export const getAllUsers = createSelector(getAdminState, (state) => selectAll(state));
