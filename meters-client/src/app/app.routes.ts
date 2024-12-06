import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./components/auth/auth.routes').then(r => r.AUTH_ROUTES) },
  { path: 'chats', loadChildren: () => import('./components/chats/chats.routes').then(r => r.CHAT_ROUTES) }
];
