import {inject, Injectable} from '@angular/core';
import {BaseBackendClient} from '../../common/http/base-backend-client';
import {Observable} from 'rxjs';
import {ChatLink} from '../../models/chats/chat-link';
import {CreateChatRequest} from '../../models/chats/create-chat-request';
import {Chat} from '../../models/chats/chat';
import {Success} from '../../models/base/success';
import {SendMessageRequest} from '../../models/chats/send-message-request';
import {ChatMessage} from '../../models/chats/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseClient = inject(BaseBackendClient);
  private readonly prefix: string = 'chats';

  getChats(): Observable<ChatLink[]> {
    const url = `${this.prefix}`
    return this.baseClient.get<ChatLink[]>(url);
  }

  createChat(request: CreateChatRequest): Observable<ChatLink> {
    const url = `${this.prefix}`;
    return this.baseClient.post<CreateChatRequest, ChatLink>(url, request);
  }

  getChat(id: number): Observable<Chat> {
    const url = `${this.prefix}/${id}`;
    return this.baseClient.get<Chat>(url);
  }

  deleteChat(id: number) {
    const url = `${this.prefix}/${id}`;
    return this.baseClient.delete<Success>(url);
  }

  addMessage(id: number, request: SendMessageRequest) {
    const url = `${this.prefix}/${id}/messages`;
    return this.baseClient.post<SendMessageRequest, ChatMessage>(url, request);
  }

  deleteMessage(id: number, messageId: number) {
    const url = `${this.prefix}/${id}/messages/${messageId}`;
    return this.baseClient.delete<Success>(url);
  }
}
