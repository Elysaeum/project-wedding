import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../shared/services/user.service';
import { WeddingService } from '../../shared/services/wedding.service';
import { User } from '../../shared/models/User';
import { Wedding } from '../../shared/models/Wedding';
import { ServiceLevel } from '../../shared/models/ServiceLevel';
import { DateFormatterPipe } from '../../shared/pipes/date-formatter.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterModule,
    DateFormatterPipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  reservedWeddings: Wedding[] = [];
  bookedWeddings: Wedding[] = [];
  serviceLevels = [ServiceLevel.Alap, ServiceLevel.Prémium, ServiceLevel.Luxus];
  isLoading = true;
  isBookingInProgress = false;

  private subscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private weddingService: WeddingService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.subscription = this.userService.getFullUserData().subscribe({
      next: (data) => {
        this.user = data.user;
        this.reservedWeddings = data.reservedWeddings.filter(w => w.status === 'Függő');
        this.bookedWeddings = data.reservedWeddings.filter(w => w.status === 'Foglalt');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Hiba a profil betöltésekor:', error);
        this.isLoading = false;
      }
    });
  }

  async updateWeddingStatus(weddingId: string, serviceLevel: string): Promise<void> {
    if (this.isBookingInProgress) return;

    this.isBookingInProgress = true;

    const index = this.reservedWeddings.findIndex(w => w.id === weddingId);
    if (index === -1) {
      this.isBookingInProgress = false;
      return;
    }

    const wedding = this.reservedWeddings[index];
    try {
      await this.weddingService.reserveWedding(weddingId, serviceLevel as ServiceLevel);
      wedding.status = 'Foglalt';
      wedding.serviceLevel = serviceLevel as ServiceLevel;

      this.reservedWeddings.splice(index, 1);
      this.bookedWeddings.push(wedding);
    } catch (error) {
      console.error('Foglalás frissítése sikertelen:', error);
    } finally {
      this.isBookingInProgress = false;
    }
  }

  onServiceLevelChange(wedding: Wedding, event: any): void {
    wedding.serviceLevel = event.value as ServiceLevel;
  }

  trackByWeddingId(index: number, wedding: Wedding): string {
    return wedding.id;
  }
}
