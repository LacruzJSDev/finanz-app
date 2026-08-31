import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PaydayRead, ProjectionPointRead } from '../../../../core/models';
import { formatMoney } from '../../../../shared/money/money';
import { isoToDate } from '../../../../shared/date/date';
import { ProjectionChart } from '../projection-chart/projection-chart';

@Component({
  selector: 'app-projection-card',
  imports: [DatePipe, MatCardModule, ProjectionChart],
  templateUrl: './projection-card.html',
  styleUrl: './projection-card.scss',
})
export class ProjectionCard {
  readonly points = input.required<ProjectionPointRead[]>();
  readonly payday = input<PaydayRead | null>(null);

  protected readonly paydayDate = computed(() => {
    const payday = this.payday();
    return payday ? isoToDate(payday.date) : null;
  });

  protected readonly paydayAmount = computed(() => {
    const payday = this.payday();
    return payday ? formatMoney(payday.amount) : null;
  });

  // La curva termina el día del cobro pero antes de cobrar, así que su último
  // punto es con lo que se llega, no lo que habrá después de cobrar.
  protected readonly arrival = computed(() => {
    const points = this.points();
    return points.length ? formatMoney(points[points.length - 1].balance) : null;
  });
}
