import { Pipe, PipeTransform } from '@angular/core';
import { FrequencyUnitEnum, PaymentPlanRead } from '../../../core/models';

const UNIT_LABELS: Record<FrequencyUnitEnum, { one: string; many: string }> = {
  [FrequencyUnitEnum.Day]: { one: 'día', many: 'días' },
  [FrequencyUnitEnum.Week]: { one: 'semana', many: 'semanas' },
  [FrequencyUnitEnum.Month]: { one: 'mes', many: 'meses' },
  [FrequencyUnitEnum.Year]: { one: 'año', many: 'años' },
};

@Pipe({ name: 'planFrequency' })
export class PlanFrequencyPipe implements PipeTransform {
  transform(plan: PaymentPlanRead): string {
    if (!plan.is_recurring) return 'Una sola vez';

    const interval = plan.frequency_interval;
    const unit = plan.frequency_unit;

    if (!interval || !unit) return 'Recurrente';

    const labels = UNIT_LABELS[unit];
    return interval === 1 ? `Cada ${labels.one}` : `Cada ${interval} ${labels.many}`;
  }
}
