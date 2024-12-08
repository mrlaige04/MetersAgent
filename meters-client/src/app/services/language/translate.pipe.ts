import {inject, Pipe, PipeTransform} from '@angular/core';
import {LanguageService} from './language.service';
import {TranslationService} from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  private readonly keySeparator = ':';
  private languageService = inject(LanguageService);
  private translateService = inject(TranslationService);

  private currentLanguage = this.languageService.currentLanguage;

  transform(value: string, key: string): string {
    const keys = key.split(this.keySeparator);
    if (keys.length === 0) return value;

    const translations = this.translateService.getTranslations(this.currentLanguage().code);
    if (!translations) return key;

    try {
      let result: any;
      for (let i = 0; i < keys.length; i++) {
        if (i === 0) {
          result = translations[keys[i]];
        } else {
          result = result[keys[i]];
        }
      }

      return result;
    } catch {
      return value;
    }
  }
}
