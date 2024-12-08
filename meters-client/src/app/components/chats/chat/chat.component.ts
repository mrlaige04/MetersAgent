import {
  AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  model,
  OnInit,
  signal, ViewChild,
  viewChild
} from '@angular/core';
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
import {AllowedIntents, RecogniseResponse} from '../../../models/llm/recognise-response';
import {Meter} from '../../../models/meters/meter';
import {DatePipe} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {LanguageService} from '../../../services/language/language.service';
import {TranslatePipe} from '../../../services/language/translate.pipe';
import {ChatLoadingComponent} from '../../layouts/chat-loading/chat-loading.component';

export interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    InputTextModule,
    Button,
    ScrollPanelModule,
    FormsModule,
    ContextMenuModule,
    DropdownModule,
    TranslatePipe,
    ChatLoadingComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [DatePipe, TranslatePipe]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private cdRef = inject(ChangeDetectorRef);
  private datePipe = inject(DatePipe);
  private translatePipe = inject(TranslatePipe);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private destroyRef = inject(DestroyRef);

  private languageService = inject(LanguageService);
  public selectedLanguage = this.languageService.currentLanguage;

  private llmProcessService = inject(LLMProcessService);
  private llmExecutorService = inject(LlmCommandExecutor);

  private chatId = signal<number | null>(null);
  private _chat = signal<Chat | null>(null);
  public chat = this._chat.asReadonly();

  public isLoading = signal(false);

  @ViewChild('messageContainer', { static: false }) private messageContainer!: ElementRef;

  public readonly contextMenuItems: MenuItem[] = [{
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => this.deleteMessage()
  }]

  ngOnInit() {
    this.getChat();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.messageContainer) {
      const container = this.messageContainer.nativeElement as HTMLElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  private getChat() {
    const id = this.route.snapshot.params['id'];
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      this.router.navigate(['/'])
      return;
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
          if (chat.messages.length === 0) {
            this.sendFirstWelcomeMessage();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
  }

  private sendFirstWelcomeMessage() {
    const message = this.translatePipe.transform('', 'UI:INITIAL_CHAT_MESSAGE');
    this.createMessage(message, true);
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

    const text = this.text();
    this.text.set('');

    this.llmProcessService.recognise({ text, lang: this.selectedLanguage().name })
      .pipe(
        catchError(error => {
          return EMPTY;
        }),
        tap((response) => {
          this.text.set('');

          if (response.success) {
            const intent = response.intent;
            const params = response.params;

            this.executeIntent(intent, params, response);
          } else {
            this.createMessage(this.getTranslatedError(response.message), true);
          }
        }),
        tap(),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.scrollToBottom();
        })
      ).subscribe();
  }

  private getTranslatedError(error: string) {
    return this.translatePipe.transform('', `UI:RESULT_ERRORS:${error}`);
  }

  private executeIntent(intent: AllowedIntents, params: any, recogniseResponse: RecogniseResponse) {
    const request = this.llmExecutorService.executeIntent(intent, params);
    if (!request) {
      this.createMessage(this.getTranslatedError('UNKNOWN_COMMAND'), true);
      return;
    }

    request.pipe(
      tap(result => {
        this.processIntentResult(intent, result, recogniseResponse);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private sendUserMessage() {
    this.createMessage(this.text(), false);
  }

  private processIntentResult(intent: AllowedIntents, result: any, recogniseResponse: RecogniseResponse) {
    let message = '';
    if (intent === 'READ') {
      const typedResult = result as Meter[];
      if (typedResult.length > 0) {
        message += `${this.translatePipe.transform('','UI:METERS_MESSAGES:METERS_LIST')} <br>`
        typedResult.forEach((m) => {
          message += `📆 ${this.datePipe.transform(m.date, 'MMM, d')}: ${m.value} <br>`
        });
      } else {
        message = this.translatePipe.transform('', 'UI:METERS_MESSAGES:NO_METERS');
      }
    } else  {
      debugger
      message = this.getTranslatedError(recogniseResponse.message);
    }

    if (message.trim().length === 0)
      message = this.translatePipe.transform('', 'UI:RESULT_ERRORS:UNEXPECTED_ERROR');

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
