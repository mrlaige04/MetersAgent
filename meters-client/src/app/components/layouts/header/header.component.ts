import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {LayoutsService} from '../../../services/layouts/layouts.service';

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
  private layoutsService = inject(LayoutsService);

  openSidebar() {
    this.layoutsService.openSidebar();
  }
}
