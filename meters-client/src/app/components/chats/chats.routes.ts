import {Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';

export const CHAT_ROUTES: Routes = [
  { path: ':id', component: ChatComponent },
]
