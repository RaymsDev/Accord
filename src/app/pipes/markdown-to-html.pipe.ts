import { Pipe, PipeTransform } from '@angular/core';
import { Converter } from 'showdown';
@Pipe({
  name: 'markdownToHtml'
})
export class MarkdownToHtmlPipe implements PipeTransform {
  private htmlConverter: Converter;
  constructor() {
    this.htmlConverter = new Converter();
  }
  transform(value: any, args?: any): string {
    return this.htmlConverter.makeHtml(value);
  }
}
