import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs';

import { UserSessionService } from 'src/user-session';

export const adminGuard: CanMatchFn = () => {
  const userSessionService = inject(UserSessionService);
  const router = inject(Router);
  return userSessionService.loaded$.pipe(
    take(1),
    switchMap((loaded) => {
      const getIsAdmin$ = () => userSessionService.userRoles$.pipe(map((userRoles) =>
        userRoles.some((userRole) => userRole === 'Admin' || userRole === 'Moderator') ||
        router.createUrlTree(['/'])
      ));
      if (loaded) return getIsAdmin$();
      userSessionService.init();
      return userSessionService.loaded$.pipe(
        take(1),
        switchMap(() => getIsAdmin$())
      );
    })
  );
};
