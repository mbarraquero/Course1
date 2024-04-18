import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs';

import { UserSessionService } from 'src/user-session';

export const loggedOutGuard: CanMatchFn = () => {
  const userSessionService = inject(UserSessionService);
  const router = inject(Router);
  return userSessionService.loaded$.pipe(
    take(1),
    switchMap((loaded) => {
      const getLoggedIn$ = () => userSessionService.loggedIn$.pipe(
        map((loggedIn) => !loggedIn || router.createUrlTree(['/lists']))
      );
      if (loaded) return getLoggedIn$();
      userSessionService.init();
      return userSessionService.loaded$.pipe(
        take(1),
        switchMap(() => getLoggedIn$())
      );
    })
  );
};
