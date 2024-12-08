import {Component, computed, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {LayoutsService} from '../../../services/layouts/layouts.service';
import {AuthClient} from '../../../services/auth/auth-client';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {Language} from '../../chats/chat/chat.component';
import {LanguageService} from '../../../services/language/language.service';
import {TranslatePipe} from '../../../services/language/translate.pipe';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    Button,
    RouterLink,
    DropdownModule,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [TranslatePipe]
})
export class HeaderComponent implements OnInit {
  private authClient = inject(AuthClient);
  private layoutsService = inject(LayoutsService);
  private languageService = inject(LanguageService);
  private translatePipe = inject(TranslatePipe);

  public languages: Language[] = this.languageService.supportedLanguages;
  public selectedLanguage = computed(() => {
    const lang = this.languageService.currentLanguage();
    const code = `UI:LANGUAGES:${lang.code}`.toUpperCase();
    const name = this.translatePipe.transform('', code);
    return { code: lang.code, name }
  })

  public isAuthenticated = computed(() => this.authClient.isAuthenticated() && this.authClient.authToken() !== null);

  ngOnInit() {
    const languages = this.languages;
    this.languages = languages.map(l => {
      const code = `UI:LANGUAGES:${l.code}`.toUpperCase();
      const name = this.translatePipe.transform('', code);
      return { ...l, name }
    });
  }

  openSidebar() {
    this.layoutsService.openSidebar();
  }

  onSelectLanguage(event: DropdownChangeEvent) {
    const lang = event.value as Language;
    this.languageService.setLanguage(lang);
    location.reload();
  }

  logout() {
    this.authClient.logout();
  }
}
