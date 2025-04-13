import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeddingService } from '../../../shared/services/wedding.service';
import { Wedding } from '../../../shared/models/Wedding';
import { DateFormatterPipe } from '../../../shared/pipes/date-formatter.pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wedding-details',
  standalone: true,
  imports: [CommonModule, DateFormatterPipe],
  templateUrl: './wedding-details.component.html',
  styleUrls: ['./wedding-details.component.scss'],
})
export class WeddingDetailsComponent implements OnInit {
  wedding$: Observable<Wedding | null> | undefined;

  constructor(
    private route: ActivatedRoute,
    private weddingService: WeddingService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.wedding$ = this.weddingService.getWeddingById(id); // Observablet kapunk itt
  }

  getServiceStyles(service: any) {
    return {
      'font-weight': service.price > 1000 ? 'bold' : 'normal',
      'color': service.price > 1000 ? '#ff4081' : '#333',
      'background-color': service.available ? '#f0f8ff' : '#f8d7da',
      'padding': '0.5rem',
      'border-radius': '5px',
      'margin-bottom': '0.5rem',
    };
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (imageUrl) {
      return imageUrl.startsWith('assets/images/') ? imageUrl : 'assets/images/' + imageUrl;
    }
    return 'assets/images/default-image.jpg'; // Ha nincs kép URL, alapértelmezett kép
  }
}
