import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ChatLink} from '../../../models/chats/chat-link';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {ChatService} from '../../../services/chats/chat.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs';
import {DialogService} from 'primeng/dynamicdialog';
import {CreateChatModalComponent} from '../create-chat-modal/create-chat-modal.component';
import {TranslatePipe} from '../../../services/language/translate.pipe';
import {NotificationService} from '../../../services/notifications/notifications.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    RouterLink,
    Button,
    TranslatePipe
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
  providers: [TranslatePipe]
})
export class ChatListComponent implements OnInit {
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private chatService = inject(ChatService);
  private translatePipe = inject(TranslatePipe);
  private notificationService = inject(NotificationService);

  private _chats: WritableSignal<ChatLink[]> = signal([]);
  public chats = this._chats.asReadonly();

  ngOnInit() {
    this.chatService.getChats()
      .pipe(
        tap((chats) => {
          this._chats.set(chats);
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
  }

  openCreateDialog() {
    const dialogRef = this.dialogService.open(CreateChatModalComponent, {
      modal: true,
      header: this.translatePipe.transform('', 'UI:START_NEW_CHAT')
    });

    dialogRef.onClose
      .pipe(
        tap((newChat?: ChatLink | null) => {
          if (newChat) {
            this._chats.update(c => [...c, newChat])
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
  }

  deleteChat(event: Event, id: number) {
    event.stopPropagation();
    this.chatService.deleteChat(id)
      .pipe(
        tap((success) => {
          if (success.isSuccess) {
            this.removeChat(id);
            this.notificationService.showSuccess(this.translatePipe.transform('', 'UI:CHATS_ACTIONS:DELETED'));
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
  }

  private removeChat(id: number) {
    const chats = this._chats();
    const filteredChats = chats.filter(c => c.id !== id);
    this._chats.set(filteredChats);
  }
}
