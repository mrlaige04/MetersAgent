import { Routes } from '@angular/router';
import {isNotAuthenticatedGuard} from './services/auth/is-not-authenticated.guard';
import {isAuthenticatedGuard} from './services/auth/is-authenticated.guard';
import {MainComponent} from './components/main/main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes').then(r => r.AUTH_ROUTES),
    canActivate: [isNotAuthenticatedGuard]
  },
  {
    path: 'chats',
    loadChildren: () => import('./components/chats/chats.routes').then(r => r.CHAT_ROUTES),
    canActivate: [isAuthenticatedGuard]
  },
  { path: '**', redirectTo: '' }
];
