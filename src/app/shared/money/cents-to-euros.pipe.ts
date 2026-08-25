import { Pipe, PipeTransform } from '@angular/core';
import { centsToEuros } from './money';

@Pipe({ name: 'centsToEuros' })
export class CentsToEurosPipe implements PipeTransform {
  transform(cents: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(
      centsToEuros(cents),
    );
  }
}
