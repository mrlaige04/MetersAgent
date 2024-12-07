import {Inject, inject, Injectable} from '@angular/core';
import {BACKEND_TOKEN} from '../../configs/backend-api';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseBackendClient {
  private http = inject(HttpClient);
  public readonly baseUrl: string = 'https://localhost:7007';

  get<TResponse>(url: string, params = {}) {
    const fullUrl = `${this.baseUrl}/${url}`;
    return this.http.get<TResponse>(fullUrl, { params });
  }

  post<TRequest, TResponse>(url: string, body: TRequest, params = {}) {
    const fullUrl = `${this.baseUrl}/${url}`;
    return this.http.post<TResponse>(fullUrl, body, { params });
  }

  delete<TResponse>(url: string, params = {}) {
    const fullUrl = `${this.baseUrl}/${url}`;
    return this.http.delete<TResponse>(fullUrl, { params });
  }
}
