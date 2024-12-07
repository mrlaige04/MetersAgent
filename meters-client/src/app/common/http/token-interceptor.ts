import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {AuthClient} from '../../services/auth/auth-client';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthClient);
  const token = auth.authToken();
  if (!auth.isAuthenticated() || !token) return next(req);

  let headers = req.headers.set('Authorization', `Bearer ${token.accessToken}`);
  return next(req.clone({ headers: headers }));
}
