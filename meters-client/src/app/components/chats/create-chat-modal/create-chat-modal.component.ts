import {Component, DestroyRef, inject} from '@angular/core';
import {ChatService} from '../../../services/chats/chat.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateChatRequest} from '../../../models/chats/create-chat-request';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TranslatePipe} from '../../../services/language/translate.pipe';
import {NotificationService} from '../../../services/notifications/notifications.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-create-chat-modal',
  standalone: true,
  imports: [
    Button,
    ReactiveFormsModule,
    InputTextModule,
    TranslatePipe
  ],
  templateUrl: './create-chat-modal.component.html',
  styleUrl: './create-chat-modal.component.scss',
  providers: [TranslatePipe]
})
export class CreateChatModalComponent {
  private dialogRef = inject(DynamicDialogRef);
  private destroyRef = inject(DestroyRef);
  private chatService = inject(ChatService);
  private notificationService = inject(NotificationService);
  private translatePipe = inject(TranslatePipe);

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
  });

  submit() {
    if (!this.form.valid) {
      return;
    }

    const request: CreateChatRequest = {
      title: this.form.value.title!
    };
    this.chatService.createChat(request)
      .pipe(
        tap((chat) => {
          this.notificationService.showSuccess(this.translatePipe.transform('', 'UI:CHATS_ACTIONS:CREATED'));
          this.dialogRef.close(chat);
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
  }
}
