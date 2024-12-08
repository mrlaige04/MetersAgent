import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageService = inject(MessageService);

  showSuccess(title: string, message?: string): void {
    this.show('success', title, message);
  }

  showWarning(title: string, message?: string): void {
    this.show('warning', title, message);
  }

  showInfo(title: string, message?: string): void {
    this.show('info', title, message);
  }

  showDanger(title: string, message?: string): void {
    this.show('danger', title, message);
  }

  private show(severity: string, title: string, message?: string): void {
    this.messageService.add({ severity, summary: title, detail: message, life: 2000, closable: true });
  }
}
