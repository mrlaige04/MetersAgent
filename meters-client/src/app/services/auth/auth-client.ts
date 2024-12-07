import {computed, inject, Injectable, signal} from '@angular/core';
import {BaseBackendClient} from '../../common/http/base-backend-client';
import {Observable} from 'rxjs';
import {TokenResponse} from '../../models/auth/token-response';
import {AuthRequest} from '../../models/auth/auth-request';

@Injectable({
  providedIn: 'root'
})
export class AuthClient {
  private readonly storageKey = 'jwt';
  private baseBackendClient = inject(BaseBackendClient);
  private readonly basePrefix = 'users';

  private _authToken = signal<TokenResponse | null>(this.getCurrentToken());
  public authToken = this._authToken.asReadonly();
  public isAuthenticated = computed(() => this._authToken() !== null);

  private getCurrentToken() {
    const fromStorage = localStorage.getItem(this.storageKey);
    if (fromStorage) {
      return JSON.parse(fromStorage) as TokenResponse;
    }
    return null;
  }

  register(request: AuthRequest): Observable<TokenResponse> {
    const url = `${this.basePrefix}/register`;
    return this.baseBackendClient.post<AuthRequest, TokenResponse>(url, request);
  }

  login(request: AuthRequest): Observable<TokenResponse> {
    const url = `${this.basePrefix}/login`;
    return this.baseBackendClient.post<AuthRequest, TokenResponse>(url, request);
  }

  public saveToken(token: TokenResponse) {
    localStorage.setItem(this.storageKey, JSON.stringify(token));
    this._authToken.set(token);
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this._authToken.set(null);
  }
}
