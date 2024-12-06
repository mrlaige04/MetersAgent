import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutsService {
  private _sidebarOpened = signal(false);
  public sidebarOpened = this._sidebarOpened.asReadonly();

  openSidebar() { this._sidebarOpened.set(true); }
  closeSidebar() { this._sidebarOpened.set(false); }
  setSidebarOpened(open: boolean) {
    this._sidebarOpened.set(open);
  }
}
