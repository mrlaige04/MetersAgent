import {Component, DestroyRef, inject, model, OnInit, signal, WritableSignal} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ChatMessage} from '../../../models/chats/message';
import {FormsModule} from '@angular/forms';
import {Chat} from '../../../models/chats/chat';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from '../../../services/chats/chat.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {catchError, EMPTY, finalize, tap} from 'rxjs';
import {SendMessageRequest} from '../../../models/chats/send-message-request';
import {ContextMenuModule} from 'primeng/contextmenu';
import {MenuItem} from 'primeng/api';
import {LLMProcessService} from '../../../services/llm-process/llm-process.service';
import {LlmCommandExecutor} from '../../../services/llm-process/llm-command-executor';
import {AllowedIntents, ParamsForIntent} from '../../../models/llm/recognise-response';
import {Meter} from '../../../models/meters/meter';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    InputTextModule,
    Button,
    ScrollPanelModule,
    FormsModule,
    ContextMenuModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [DatePipe]
})
export class ChatComponent implements OnInit {
  private datePipe = inject(DatePipe);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private destroyRef = inject(DestroyRef);

  private llmProcessService = inject(LLMProcessService);
  private llmExecutorService = inject(LlmCommandExecutor);

  private chatId = signal<number | null>(null);
  private _chat = signal<Chat | null>(null);
  public chat = this._chat.asReadonly();

  public isLoading = signal(false);

  public readonly contextMenuItems: MenuItem[] = [{
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => this.deleteMessage()
  }]

  ngOnInit() {
    this.getChat();
  }

  private getChat() {
    const id = this.route.snapshot.params['id'];
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      this.router.navigate(['/'])
      return; // TODO: RETURN TO CHAT LIST
    }

    this.chatId.set(numId);
    this.chatService.getChat(numId)
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            this.router.navigate(['/'])
          }
          return EMPTY;
        }),
        tap((chat: Chat) => {
          this._chat.set(chat);
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
  }

  public text = model<string>('');

  public selectedMessage = signal<ChatMessage | null>(null);

  onContextMenu(event: Event, message: ChatMessage) {
    this.selectedMessage.set(message);
  }

  onHide() {
    this.selectedMessage.set(null);
  }

  sendMessage() {
    if (this.text()!.trim().length === 0) return;

    this.isLoading.set(true);
    this.sendUserMessage();

    this.llmProcessService.recognise({ text: this.text() })
      .pipe(
        catchError(error => {
          if (error.status === 400) {
            console.log(error)
          }
          return EMPTY;
        }),
        tap((response) => {
          this.text.set('');

          if (response.success) {
            const intent = response.intent;
            const params = response.params;

            this.executeIntent(intent, params);
          } else {
            this.createMessage(response.message, true);
          }
        }),
        tap(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();

    this.isLoading.set(false);
  }

  private executeIntent(intent: AllowedIntents, params: any) {
    const request = this.llmExecutorService.executeIntent(intent, params);
    if (!request) {
      this.createMessage('Unknown command', true);
      return;
    }

    request.pipe(
      tap(result => {
        this.processIntentResult(intent, result);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private sendUserMessage() {
    this.createMessage(this.text(), false);
  }

  private processIntentResult(intent: AllowedIntents, result: any) {
    let message = '';
    if (intent === 'READ') {
      const typedResult = result as Meter[];
      if (typedResult.length > 0) {
        typedResult.forEach((m) => {
          message += `📆 ${this.datePipe.transform(m.date, 'MMM, d')}: ${m.value} <br>`
        });
      } else {
        message = 'No meters available :('
      }
    } else if (intent === 'SEND') {
      message = 'Дані успішно відправлено!'
    } else {
      message = 'Unknown command! Please try again.'
    }

    this.createMessage(message, true);
  }

  private createMessage(content: string, isSystem: boolean) {
    const message: SendMessageRequest = { content, isSystem };
    this.chatService.addMessage(this.chatId()!, message)
      .pipe(
        tap((message) => {
          //if (message.isSystem) this.text.set('');

          this._chat.update(c => {
            return { ...c!, messages: [...c!.messages, message] }
          })
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
  }

  deleteMessage() {
    if (this.selectedMessage() === null) return;
    if (this.selectedMessage()?.isSystem) {
      return;
    }
    const id = this.selectedMessage()!.id;

    this.chatService.deleteMessage(this.chatId()!, id)
      .pipe(
        tap((success) => {
          if (success.isSuccess) {
            this.removeMessage(id);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.selectedMessage.set(null))
      ).subscribe();
  }

  private removeMessage(id: number) {
    const messages = this._chat()?.messages!;
    const filteredMessages = messages.filter(m => m.id !== id);
    this._chat.update(c => {
      return { ...c!, messages: filteredMessages };
    })
  }
}
