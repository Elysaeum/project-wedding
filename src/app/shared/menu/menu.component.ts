import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Input() userName: string = 'Vendég';

  @Output() logoutEvent = new EventEmitter<void>();
  @Output() navigateEvent = new EventEmitter<string>();
  @Output() menuClosed = new EventEmitter<void>();

  constructor() {
    console.log('constructor called');
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
  }

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
      this.menuClosed.emit();
    }
  }

  navigateTo(route: string) {
    this.navigateEvent.emit(route);
    this.closeMenu();
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    this.logoutEvent.emit();
    this.closeMenu();
  }
}
