import { Component, OnInit } from '@angular/core';
import { WeddingService } from '../../shared/services/wedding.service';
import { UserService } from '../../shared/services/user.service';
import { Wedding } from '../../shared/models/Wedding';
import { ServiceLevel } from '../../shared/models/ServiceLevel'; // Az enum importálása
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DateFormatterPipe } from '../../shared/pipes/date-formatter.pipe';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';


@Component({
  selector: 'app-wedding',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    DateFormatterPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.scss']
})
export class WeddingComponent implements OnInit {
  title = 'Esküvői foglalások';
  weddings: Wedding[] = [];
  filteredWeddings: Wedding[] = [];
  searchTerm = '';
  selectedServiceLevel: ServiceLevel | null = null;
  currentUser: User | null = null;
  userFavorites: Wedding[] = [];

  constructor(
    private weddingService: WeddingService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadWeddings();

    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.userFavorites = user.liked_weddings.map(id => ({ id } as Wedding));
      }
    });
  }

  async loadWeddings(): Promise<void> {
    try {
      this.weddings = await this.weddingService.getAllWeddings();
      this.filteredWeddings = this.weddings;
    } catch (error) {
      console.error('Esküvők betöltése sikertelen:', error);
    }
  }

  filterWeddings(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredWeddings = this.weddings.filter(wedding =>
      wedding.title.toLowerCase().includes(searchTermLower) ||
      (typeof wedding.location === 'string' && wedding.location.toLowerCase().includes(searchTermLower))
    );
  }

  async toggleWeddingStatus(wedding: Wedding): Promise<void> {
    if (wedding.status === 'Elérhető') {
      try {
        await this.weddingService.updateWeddingStatus(wedding.id, 'Függő');
        wedding.status = 'Függő';

        const currentUser = this.authService.getCurrentUserSync();
        if (currentUser) {
          await this.userService.reserveWeddingForUser(currentUser.uid, wedding.id);
          console.log('Esküvő sikeresen lefoglalva');
        } else {
          console.warn('Nincs bejelentkezett felhasználó');
        }
      } catch (err) {
        console.error('Státusz frissítés sikertelen', err);
      }
    } else {
      console.log('Ez az esküvő már nem foglalható!');
    }
  }

  isFavorite(id: string): boolean {
    return this.userFavorites.some(wedding => wedding.id === id);
  }

  toggleFavorite(wedding: Wedding): void {
    if (this.isFavorite(wedding.id)) {
      this.userService.unlikeWedding(wedding.id);
    } else {
      this.userService.likeWedding(wedding);
    }
  }

  async selectServiceLevel(serviceLevel: ServiceLevel, wedding: Wedding): Promise<void> {
    if (wedding.status === 'Elérhető') {
      this.selectedServiceLevel = serviceLevel;
      await this.weddingService.updateWeddingStatus(wedding.id, 'Függő');
    }
  }

  async confirmReservation(wedding: Wedding): Promise<void> {
    if (!this.selectedServiceLevel) {
      console.log('Nincs kiválasztott szolgáltatási szint!');
      return;
    }

    try {
      await this.weddingService.reserveWedding(wedding.id, this.selectedServiceLevel);
      wedding.status = 'Foglalt';
      this.selectedServiceLevel = null;
      console.log('Foglalás sikeres!');
    } catch (err) {
      console.error('Foglalás sikertelen:', err);
    }
  }

  getLocationName(location: string | { name: string }): string {
    return typeof location === 'object' && location !== null ? location.name : location;
  }
}
