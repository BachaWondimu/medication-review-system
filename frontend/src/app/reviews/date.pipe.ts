import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {

  transform(value:number): string {
    return new Date(value).toLocaleDateString();
  }

}
