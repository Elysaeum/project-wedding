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

@Component({
  selector: 'app-wedding',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    DateFormatterPipe
  ],
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.scss']
})
export class WeddingComponent implements OnInit {
  title: string = 'Esküvői foglalások';
  weddings: Wedding[] = [];
  selectedServiceLevel: ServiceLevel | null = null; // Itt használd az enumot

  constructor(
    private weddingService: WeddingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadWeddings();
  }

  loadWeddings(): void {
    this.weddingService.getAllWeddings().subscribe(weddings => {
      this.weddings = weddings;
    });
  }

  toggleWeddingStatus(wedding: Wedding): void {
    if (wedding.status === 'Elérhető') {
      this.weddingService.updateWeddingStatus(wedding.id, 'Függő');
      this.userService.reserveWedding(wedding);
    } else {
      console.log('Ez az esküvő már nem foglalható!');
    }
  }

  isFavorite(id: number): boolean {
    return this.userService.getCurrentUser().liked_weddings.some(w => w.id === id);
  }

  toggleFavorite(wedding: Wedding): void {
    if (this.isFavorite(wedding.id)) {
      this.userService.unlikeWedding(wedding.id);
    } else {
      this.userService.likeWedding(wedding);
    }
  }

  selectServiceLevel(serviceLevel: ServiceLevel, wedding: Wedding): void { // Használd az enumot itt
    // Ellenőrizd, hogy az esküvő elérhető-e
    if (wedding.status === 'Elérhető') {
      this.selectedServiceLevel = serviceLevel;
      // Az esküvő státusza függőre változik, ha kiválasztották a szolgáltatási szintet
      this.weddingService.updateWeddingStatus(wedding.id, 'Függő');
    }
  }

  confirmReservation(wedding: Wedding): void {
    if (this.selectedServiceLevel) {
      this.weddingService.reserveWedding(wedding.id, this.selectedServiceLevel);
      this.selectedServiceLevel = null;  // Resetálás a választott szint után
    } else {
      console.log('Nincs kiválasztott szolgáltatási szint!');
    }
  }
}
