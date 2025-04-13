import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter',
  standalone: true
})
export class DateFormatterPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
  
    try {
      const date = typeof value === 'string' ? new Date(value) : value;
      if (isNaN(date.getTime())) return String(value);
  
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      return String(value);
    }
  }
  

}
