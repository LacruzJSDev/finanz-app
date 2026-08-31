import { Pipe, PipeTransform } from '@angular/core';
import { FrequencyUnitEnum } from '../../../core/models';

const FREQUENCY_UNIT_LABELS: Record<FrequencyUnitEnum, string> = {
  [FrequencyUnitEnum.Day]: 'Días',
  [FrequencyUnitEnum.Week]: 'Semanas',
  [FrequencyUnitEnum.Month]: 'Meses',
  [FrequencyUnitEnum.Year]: 'Años',
};

@Pipe({ name: 'frequencyUnitLabel' })
export class FrequencyUnitLabelPipe implements PipeTransform {
  transform(unit: FrequencyUnitEnum): string {
    return FREQUENCY_UNIT_LABELS[unit];
  }
}
