import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeddingService } from '../../../shared/services/wedding.service';
import { Wedding } from '../../../shared/models/Wedding';
import { DateFormatterPipe } from '../../../shared/pipes/date-formatter.pipe';
import { ServicePricePipe } from '../../../shared/pipes/service-price.pipe';
import { Service } from '../../../shared/models/Service';
import { WeddingLocation } from '../../../shared/models/WeddingLocation';

@Component({
  selector: 'app-wedding-details',
  standalone: true,
  imports: [CommonModule, DateFormatterPipe, ServicePricePipe],
  templateUrl: './wedding-details.component.html',
  styleUrls: ['./wedding-details.component.scss'],
})
export class WeddingDetailsComponent implements OnInit {
  wedding?: Wedding;
  location?: WeddingLocation | null;
  services: Service[] = [];

  constructor(
    private route: ActivatedRoute,
    private weddingService: WeddingService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      const wedding = await this.weddingService.getWeddingById(id);
      if (!wedding) return;

      this.wedding = wedding;
      [this.location, this.services] = await Promise.all([
        this.weddingService.getLocationById(wedding.location),
        this.weddingService.getServicesByIds(wedding.services)
      ]
);
} catch (error) {
  console.error('Hiba az esküvői adatok betöltésekor:', error);
}
  }

  getServiceStyles(service: Service): { [key: string]: string } {
    return {
      'font-weight': service.price > 1000 ? 'bold' : 'normal',
      'color': service.price > 1000 ? '#ff4081' : '#333',
      'background-color': service.available ? '#f0f8ff' : '#f8d7da',
      'padding': '0.5rem',
      'border-radius': '5px',
      'margin-bottom': '0.5rem',
    };
  }

  getImageUrl(imageUrl?: string): string {
    return imageUrl?.startsWith('assets/images/')
      ? imageUrl
      : `assets/images/${imageUrl || 'default-image.jpg'}`;
  }
}
