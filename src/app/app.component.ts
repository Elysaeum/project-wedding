// app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service'; // importáld be
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'wedding';
  isLoggedIn = false;
  userName = 'Vendég';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.userName = status ? (localStorage.getItem('userName') || 'Felhasználó') : 'Vendég';
    });
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigate(['/home']);
  }

  onNavigate(route: string): void {
    console.log('Navigáció történt ide:', route);
  }

  onMenuClosed(): void {
    console.log('Menü bezáródott');
  }

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }
}
