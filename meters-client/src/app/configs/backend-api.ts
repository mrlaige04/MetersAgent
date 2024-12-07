import {environment} from '../../environments/environment';
import {Provider} from '@angular/core';

export const BACKEND_TOKEN = 'BACKEND_TOKEN';

const getBackendApiUrl = () => environment.backendApi;

export const backendApiProvider: Provider = {
  provide: BACKEND_TOKEN,
  useValue: getBackendApiUrl()
};
