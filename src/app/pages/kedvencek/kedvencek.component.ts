import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { Wedding } from '../../shared/models/Wedding';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-kedvencek',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './kedvencek.component.html',
  styleUrls: ['./kedvencek.component.scss']
})
export class KedvencekComponent implements OnInit {
  favoriteWeddings: Wedding[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.favoriteWeddings = this.userService.getCurrentUser().liked_weddings;
  
    this.favoriteWeddings.forEach(wedding => {
      if (wedding.imageUrl && wedding.imageUrl.startsWith('assets/images/')) {
        wedding.imageUrl = wedding.imageUrl.replace('assets/images/', '');
      }
    });
  }

  removeFromFavorites(weddingId: number): void {
    this.userService.unlikeWedding(weddingId);
    this.favoriteWeddings = this.userService.getCurrentUser().liked_weddings;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.jpg';
  }
  
}
