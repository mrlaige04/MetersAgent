import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthClient} from './auth-client';

export const isNotAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthClient);
  if (!auth.isAuthenticated() || auth.authToken() === null) {
    return true;
  }

  const router = inject(Router);
  await router.navigate(['/']);
  return false;
};
