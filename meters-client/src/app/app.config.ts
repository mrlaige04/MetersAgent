import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {backendApiProvider} from './configs/backend-api';
import {textProcessorApiProvider} from './configs/text-processor';
import {tokenInterceptor} from './common/http/token-interceptor';
import {DialogService} from 'primeng/dynamicdialog';
import {handleUnauthorizedInterceptor} from './common/http/handle-unauthrorized.interceptor';
import {NotificationService} from './services/notifications/notifications.service';
import {MessageService} from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor, handleUnauthorizedInterceptor])),
    backendApiProvider,
    textProcessorApiProvider,
    DialogService,
    MessageService,
    NotificationService
  ]
};
