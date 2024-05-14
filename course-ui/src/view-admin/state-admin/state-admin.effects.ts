import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

import { ApiUsersWithRoles } from 'src/api-models';
import { ErrorService } from 'src/error';
import { UserSessionService } from 'src/user-session';

import { HttpUserService } from './api/http-admin.service';

import * as AdminActions from './state-admin.actions';
import { Role } from './state-admin.models';
import { AdminPartialState } from './state-admin.reducer';
import * as AdminSelectors from './state-admin.selectors';

@Injectable()
export class AdminEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.init),
      withLatestFrom(this.sessionService.userRoles$),
      switchMap(([_, userRoles]) => {
        if (userRoles.includes("Admin")) return [
          AdminActions.loadUsersWithRole(),
          AdminActions.loadPhotosToModerate(),
        ];
        else if (userRoles.includes("Moderator")) return [
          AdminActions.loadPhotosToModerate(),
        ];
        return [];
      })
    )
  );

  loadUsersWithRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadUsersWithRole),
      switchMap(() =>
        this.api.getUsersWithRole().pipe(
          map((users) => AdminActions.loadUsersWithRoleSuccess({ users })),
          catchError((error) => of(AdminActions.loadUsersWithRoleFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateUserRoles),
      switchMap(({ user }) => {
        const apiUserUpdate = {
          username: user.username,
          roles: user.roles,
        } as ApiUsersWithRoles;
        return this.api.updateUserRoles(apiUserUpdate).pipe(
          map((roles) => AdminActions.updateUserRolesSuccess({
            user: {
              ...user,
              roles: roles as Role[]
            }
          })),
          catchError((error) => of(AdminActions.updateUserRolesFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        );
      })
    )
  );
  
  loadPhotosToModerate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadPhotosToModerate),
      switchMap(() =>
        this.api.getPhotosToModerate().pipe(
          map((apiPhotosToModerate) => AdminActions.loadPhotosToModerateSuccess({
            photosToModerate: apiPhotosToModerate.map((apiPhoto) => ({
              id: apiPhoto.id,
              username: apiPhoto.username,
              url: apiPhoto.url,
            }))
          })),
          catchError((error) => of(AdminActions.loadPhotosToModerateFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  approvePhotoToModerate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.approvePhotoToModerate),
      withLatestFrom(
        this.store.pipe(select(AdminSelectors.getPhotosToModerate)),
      ),
      switchMap(([{ photoToModerate }, photosToModerate]) =>
        this.api.approvePhoto(photoToModerate.id).pipe(
          map(() => AdminActions.approvePhotoToModerateSuccess({
            photosToModerate: photosToModerate?.filter((photo) => photo.id !== photoToModerate.id) ?? []
          })),
          catchError((error) => of(AdminActions.approvePhotoToModerateFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  rejectPhotoToModerate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.rejectPhotoToModerate),
      withLatestFrom(
        this.store.pipe(select(AdminSelectors.getPhotosToModerate)),
      ),
      switchMap(([{ photoToModerate }, photosToModerate]) =>
        this.api.removePhoto(photoToModerate.id).pipe(
          map(() => AdminActions.rejectPhotoToModerateSuccess({
            photosToModerate: photosToModerate?.filter((photo) => photo.id !== photoToModerate.id) ?? []
          })),
          catchError((error) => of(AdminActions.rejectPhotoToModerateFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  genericError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AdminActions.loadUsersWithRoleFailure,
          AdminActions.updateUserRolesFailure,
          AdminActions.loadPhotosToModerateFailure,
          AdminActions.approvePhotoToModerateFailure,
          AdminActions.rejectPhotoToModerateFailure,
          // drop here errors to be generically handled
        ),
        tap(({ error }) => this.errorService.handleError(error as HttpErrorResponse))
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<AdminPartialState>,
    private readonly api: HttpUserService,
    private readonly sessionService: UserSessionService,
    private readonly errorService: ErrorService,
  ) {}
}
