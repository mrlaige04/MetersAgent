import {Injectable, signal} from '@angular/core';
import {Language} from '../../components/chats/chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'current-lang';
  public supportedLanguages: Language[] = [
    { code: 'uk', name: 'Ukrainian' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }
  ];

  private _currentLanguage = signal<Language>(this.initLanguage());
  public currentLanguage = this._currentLanguage.asReadonly();

  private initLanguage() {
    const fromStorage = localStorage.getItem(this.storageKey);
    const key = fromStorage ?? 'uk';
    const lang = this.supportedLanguages.find(l => l.code === key) ?? this.supportedLanguages[0];
    localStorage.setItem(this.storageKey, lang.code);
    return lang;
  }

  public setLanguage(lang: Language): void {
    localStorage.setItem(this.storageKey, lang.code);
    this._currentLanguage.set(lang);
  }
}
