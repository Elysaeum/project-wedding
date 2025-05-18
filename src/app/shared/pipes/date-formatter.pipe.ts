import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter',
  standalone: true
})
export class DateFormatterPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    try {
      let date: Date;

      if (value instanceof Date) {
        date = value;
      } else if (value?.seconds) {
        date = new Date(value.seconds * 1000); 
      } else if (typeof value === 'string') {
        date = new Date(value);
      } else {
        return String(value);
      }

      if (isNaN(date.getTime())) return String(value);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch {
      return String(value);
    }
  }
}
