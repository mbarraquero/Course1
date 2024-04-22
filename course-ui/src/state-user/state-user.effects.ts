import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ErrorService } from 'src/error';

import { HttpUserService } from './api/http-user.service';

import * as UserActions from './state-user.actions';
import { User } from './state-user.models';
import { UserPartialState } from './state-user.reducer';
import * as UserSelectors from './state-user.selectors';

@Injectable()
export class UserEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.init),
      switchMap(() =>
        this.api.getUsers().pipe(
          map((apiUsers) => UserActions.initSuccess({
            users: apiUsers.map((apiUser) => ({
              id: apiUser.id,
              userName: apiUser.userName,
              knownAs: apiUser.knownAs,
              photoUrl: apiUser.photoUrl,
              city: apiUser.city,
            } as User))
          })),
          catchError((error) => of(UserActions.initFailure({
            error: this.errorService.getErrorMessage(error)
          })))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ userName: username }) =>
        // just in case this entity changes in the future, otherwise we could use the id to select from the loaded list
        this.api.getUserByName(username).pipe(
          map((apiUser) => UserActions.loadUserSuccess({
            user: {
              id: apiUser.id,
              userName: apiUser.userName,
              photoUrl: apiUser.photoUrl,
              age: apiUser.age,
              knownAs: apiUser.knownAs,
              created: apiUser.created,
              lastActive: apiUser.lastActive,
              introduction: apiUser.introduction,
              lookingFor: apiUser.lookingFor,
              interests: apiUser.interests,
              city: apiUser.city,
              country: apiUser.country,
              photos: apiUser.photos.map((apiPhoto) => ({
                id: apiPhoto.id,
                url: apiPhoto.url,
              }))
            } as User
          })),
          catchError((error) => of(UserActions.loadUserFailure({
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
          UserActions.initFailure,
          UserActions.loadUserFailure,
          // drop here errors to be generically handled
        ),
        tap(({ error }) => this.errorService.handleError(error as HttpErrorResponse))
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<UserPartialState>,
    private readonly api: HttpUserService,
    private readonly errorService: ErrorService,
  ) {}
}
