import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {

  // text truncation pipe

  transform(value: string | null | undefined, args: any[]): string {
    if (value == null) { // This checks for both null and undefined
      return ''; // Return an empty string or any other default value
    }
    const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
    const trail = args.length > 1 ? args[1] : '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
  

}

@Pipe({
    name: 'pluralize',
    standalone: true
})
export class PluralPipe implements PipeTransform {

  // https://typeofweb.com/odmiana-rzeczownikow-przy-liczebnikach-jezyku-polskim/

  transform(
    n: number,
    singularNominativ: string,
    pluralNominativ: string,
    pluralGenitive: string
  ): string {
    if (n === 1) {
       return singularNominativ;
    } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
      return pluralNominativ;
    } else {
      return pluralGenitive;
    }
  }

}
@Pipe({
  name: 'stripHtml',
  standalone: true
})
export class StripHtmlPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return value.replace(/<[^>]+>/g, ''); // This regex removes HTML tags
  }

}
