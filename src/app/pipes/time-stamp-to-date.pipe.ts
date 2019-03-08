import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeStampToDate'
})
export class TimeStampToDatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return new Date(value).toLocaleString();
  }
}
