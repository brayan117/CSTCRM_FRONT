import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { homeRouteForRole } from '../navigation';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.isAuthenticated() ? router.createUrlTree([homeRouteForRole(auth.role())]) : true;
};

export function roleGuard(allowed: string[]): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);
    const role = auth.role();
    if (allowed.includes(role)) return true;
    if (!role) return router.createUrlTree(['/login']);
    return router.createUrlTree([homeRouteForRole(role)]);
  };
}
