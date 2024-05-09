import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { ApiUsersWithRoles } from 'src/api-models';
import { ErrorService } from 'src/error';

import { HttpUserService } from './api/http-admin.service';

import * as AdminActions from './state-admin.actions';
import { Role } from './state-admin.models';
// import { AdminPartialState } from './state-admin.reducer';
// import * as AdminSelectors from './state-admin.selectors';

@Injectable()
export class AdminEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.init),
      map(() => AdminActions.loadUsersWithRole())
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

  genericError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AdminActions.loadUsersWithRoleFailure,
          AdminActions.updateUserRolesFailure,
          // drop here errors to be generically handled
        ),
        tap(({ error }) => this.errorService.handleError(error as HttpErrorResponse))
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    // private readonly store: Store<AdminPartialState>,
    private readonly api: HttpUserService,
    private readonly errorService: ErrorService,
  ) {}
}
