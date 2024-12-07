import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {ChatListComponent} from '../chats/chat-list/chat-list.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Button,
    ChatListComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
