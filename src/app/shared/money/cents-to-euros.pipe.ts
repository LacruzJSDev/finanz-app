import { Pipe, PipeTransform } from '@angular/core';
import { formatMoney } from './money';

@Pipe({ name: 'centsToEuros' })
export class CentsToEurosPipe implements PipeTransform {
  transform(cents: number, currency = 'EUR'): string {
    return formatMoney(cents, currency);
  }
}
