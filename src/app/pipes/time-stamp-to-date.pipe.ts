import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeStampToDate'
})
export class TimeStampToDatePipe implements PipeTransform {
  transform(value: any, args?: any): string {
    return new Date(value).toLocaleString();
  }
}
