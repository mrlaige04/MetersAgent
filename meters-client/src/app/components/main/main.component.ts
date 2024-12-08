import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {ChatListComponent} from '../chats/chat-list/chat-list.component';
import {TranslatePipe} from '../../services/language/translate.pipe';
import {AuthClient} from '../../services/auth/auth-client';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Button,
    ChatListComponent,
    TranslatePipe
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private authService = inject(AuthClient);
  public isAuthenticated = this.authService.isAuthenticated;
}
