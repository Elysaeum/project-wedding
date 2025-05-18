import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  currentIndex = 0;
  images: string[] = ['loire.jpg', 'maldives.jpg', 'toszkana.jpg']; 
  isHighlighted = true;
  quoteColor = 'darkred';
  quoteFontSize = '1.5rem';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    this.startSlideshow();
  }

  changePage() {
    this.router.navigate(['/wedding']);
  }

  startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }
}