import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { Wedding } from '../../shared/models/Wedding';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kedvencek',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './kedvencek.component.html',
  styleUrls: ['./kedvencek.component.scss']
})
export class KedvencekComponent implements OnInit, OnDestroy {
  favoriteWeddings: Wedding[] = [];
  private subscriptions = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const sub = this.userService.getFullUserData().subscribe(({ likedWeddings }) => {
      this.favoriteWeddings = likedWeddings.map(wedding => ({
        ...wedding,
        imageUrl: wedding.imageUrl?.replace('assets/images/', '') ?? ''
      }));
    });

    this.subscriptions.add(sub);
  }

  removeFromFavorites(weddingId: string): void {
    this.userService.unlikeWedding(weddingId).then(() => {
      this.favoriteWeddings = this.favoriteWeddings.filter(w => w.id !== weddingId);
    }).catch(err => {
      console.error('Hiba a kedvenc eltávolításakor:', err);
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.jpg';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
