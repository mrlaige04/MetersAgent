import {Component, computed, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {LayoutsService} from '../../../services/layouts/layouts.service';
import {AuthClient} from '../../../services/auth/auth-client';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    Button,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authClient = inject(AuthClient);
  private layoutsService = inject(LayoutsService);

  public isAuthenticated = computed(() => this.authClient.isAuthenticated() && this.authClient.authToken() !== null);

  openSidebar() {
    this.layoutsService.openSidebar();
  }

  logout() {
    this.authClient.logout();
  }
}
