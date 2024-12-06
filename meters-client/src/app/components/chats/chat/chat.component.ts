import {Component, model, signal, WritableSignal} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {Messages} from 'primeng/messages';
import {ChatMessage} from '../../../models/chats/message';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    InputTextModule,
    Button,
    ScrollPanelModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  private _messages: WritableSignal<ChatMessage[]> = signal([]);
  public messages = this._messages.asReadonly();

  public isLoading = signal(false);

  private counter = 1;

  public text = model<string>();

  sendMessage() {
    this.isLoading.set(true);
    this._messages.update(m => [...m, {
      text: this.text()!,
      user: {
        id: 1,
        email: 'test'
      },
      id: ++this.counter
    }]);
    this.text.set('');
    this.isLoading.set(false);
  }
}
