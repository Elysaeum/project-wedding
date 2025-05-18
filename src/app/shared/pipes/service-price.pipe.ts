import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'servicePrice',
  standalone: true
})
export class ServicePricePipe implements PipeTransform {
  transform(price: number): string {
    if (typeof price !== 'number') return '';
    const formattedPrice = price.toLocaleString('hu-HU');
    return price > 1000 ? `${formattedPrice} Ft (drága)` : `${formattedPrice} Ft`;
  }
}
