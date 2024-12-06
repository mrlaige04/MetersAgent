import {Component, signal, WritableSignal} from '@angular/core';
import {ChatLink} from '../../../models/chats/chat-link';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    RouterLink,
    Button
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  private _chats: WritableSignal<ChatLink[]> = signal([
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
    { id: 1, name: 'Test' },
  ]);
  public chats = this._chats.asReadonly();
}
