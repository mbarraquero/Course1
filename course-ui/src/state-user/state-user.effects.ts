import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';

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
              userName: apiUser.userName
            } as User))
          })),
          catchError((error) => of(UserActions.initFailure({ error })))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<UserPartialState>,
    private readonly api: HttpUserService,
  ) {}
}
