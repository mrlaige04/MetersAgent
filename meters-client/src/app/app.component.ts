import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/layouts/header/header.component';
import {SidebarModule} from 'primeng/sidebar';
import {LayoutsService} from './services/layouts/layouts.service';
import {Button} from 'primeng/button';
import {ChatListComponent} from './components/chats/chat-list/chat-list.component';
import {TranslatePipe} from './services/language/translate.pipe';
import {ToastModule} from 'primeng/toast';
import {registerLocaleData} from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarModule, Button, ChatListComponent, TranslatePipe, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private layoutsService = inject(LayoutsService);
  title = 'meters-client';

  public sidebarOpened = this.layoutsService.sidebarOpened;

  setSidebarOpened(open: boolean) {
    this.layoutsService.setSidebarOpened(open);
  }

  ngOnInit() {
    registerLocaleData(localeUk, 'uk');
    registerLocaleData(localeEn, 'en');
    registerLocaleData(localeDe, 'de');
  }
}
