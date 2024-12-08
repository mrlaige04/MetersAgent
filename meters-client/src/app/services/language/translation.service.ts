import {Injectable} from '@angular/core';
import {EN_TRANSLATIONS} from '../../localization/en';
import {UK_TRANSLATIONS} from '../../localization/uk';
import {DE_TRANSLATIONS} from '../../localization/de';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly translationsMap: Map<string, any> = new Map<string, any>();

  constructor() {
    this.translationsMap.set('en', EN_TRANSLATIONS);
    this.translationsMap.set('uk', UK_TRANSLATIONS);
    this.translationsMap.set('de', DE_TRANSLATIONS);
  }

  public getTranslations(lang: string) {
    return this.translationsMap.get(lang) ?? null;
  }
}
