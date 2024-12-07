import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthClient} from '../../services/auth/auth-client';
import {tap} from 'rxjs';
import {Router} from '@angular/router';

export const handleUnauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthClient);
  const router = inject(Router);
  return next(req).pipe(
    tap({
      next: () => {},
      error: (err) => {
        if (err.status === 401) {
          auth.logout();
          router.navigate(['auth', 'login']);
        }
      }
    })
  );
};
