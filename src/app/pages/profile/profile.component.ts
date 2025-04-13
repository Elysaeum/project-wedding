import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { WeddingService } from '../../shared/services/wedding.service';
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
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterModule,
    DateFormatterPipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  ProfileObject: any;
  reservedWeddings: Wedding[] = [];
  bookedWeddings: Wedding[] = [];
  selectedServiceLevel: ServiceLevel = ServiceLevel.Alap;
  serviceLevels: ServiceLevel[] = [ServiceLevel.Alap, ServiceLevel.Prémium, ServiceLevel.Luxus]; 
  isBookingInProgress = false;

  constructor(private userService: UserService, private weddingService: WeddingService) {}

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.ProfileObject = currentUser;
      this.updateReservedWeddings();
    }
  }

  updateReservedWeddings(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.reservedWeddings = currentUser.reserved_weddings.filter((w: Wedding) => w.status === 'Függő');
      this.bookedWeddings = currentUser.reserved_weddings.filter((w: Wedding) => w.status === 'Foglalt');
    }
  }

  updateWeddingStatus(weddingId: number, serviceLevel: ServiceLevel): void {
    if (this.isBookingInProgress) return;

    this.isBookingInProgress = true;
    const index = this.reservedWeddings.findIndex(w => w.id === weddingId);

    if (index > -1) {
      const wedding = this.reservedWeddings[index];
      wedding.serviceLevel = serviceLevel;
      wedding.status = 'Foglalt';

      this.weddingService.updateWeddingStatus(wedding.id, 'Foglalt');
      this.userService.updateReservedWedding(wedding.id, serviceLevel);

      this.reservedWeddings.splice(index, 1);
      this.bookedWeddings.push(wedding);
    }

    this.isBookingInProgress = false;
  }

  isWeddingBooked(wedding: Wedding): boolean {
    return wedding.status === 'Foglalt';
  }

  onServiceLevelChange(wedding: Wedding, event: any): void {
    wedding.serviceLevel = event.value as ServiceLevel;
  }
}
