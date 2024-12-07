import {Component, DestroyRef, inject} from '@angular/core';
import {ChatService} from '../../../services/chats/chat.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateChatRequest} from '../../../models/chats/create-chat-request';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-create-chat-modal',
  standalone: true,
  imports: [
    Button,
    ReactiveFormsModule,
    InputTextModule
  ],
  templateUrl: './create-chat-modal.component.html',
  styleUrl: './create-chat-modal.component.scss'
})
export class CreateChatModalComponent {
  private dialogRef = inject(DynamicDialogRef);
  private destroyRef = inject(DestroyRef);
  private chatService = inject(ChatService);

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
          this.dialogRef.close(chat);
        }),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
  }
}
