import { Component, computed, input } from '@angular/core';
import { ProjectionPointRead } from '../../../../core/models';

const WIDTH = 320;
const HEIGHT = 110;
const PADDING = 6;

/**
 * La curva del saldo, punto a punto. No sabe qué mide ni de dónde sale: recibe
 * valores y devuelve un trazo.
 *
 * El viewBox es fijo y la escala proporcional, así que el trazo y los puntos no
 * se deforman al cambiar el ancho. Estirar el SVG habría convertido los
 * círculos en óvalos.
 */
@Component({
  selector: 'app-projection-chart',
  templateUrl: './projection-chart.html',
  styleUrl: './projection-chart.scss',
})
export class ProjectionChart {
  readonly points = input.required<ProjectionPointRead[]>();

  protected readonly viewBox = `0 0 ${WIDTH} ${HEIGHT}`;

  private readonly coords = computed(() => {
    const points = this.points();
    if (!points.length) return [];

    const values = points.map((point) => point.balance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Todo plano: se dibuja a media altura en vez de dividir por cero.
    const span = max - min || 1;
    const usable = HEIGHT - PADDING * 2;
    const step = points.length > 1 ? (WIDTH - PADDING * 2) / (points.length - 1) : 0;

    return points.map((point, index) => ({
      x: PADDING + step * index,
      y: PADDING + usable - ((point.balance - min) / span) * usable,
    }));
  });

  protected readonly line = computed(() =>
    this.coords()
      .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(' '),
  );

  /** El mismo trazo cerrado contra la base, para el relleno. */
  protected readonly area = computed(() => {
    const coords = this.coords();
    if (!coords.length) return '';
    const first = coords[0];
    const last = coords[coords.length - 1];
    return `${this.line()} L${last.x.toFixed(1)} ${HEIGHT} L${first.x.toFixed(1)} ${HEIGHT} Z`;
  });

  // Solo los extremos y los escalones: marcar cada día llenaría la curva de
  // puntos que no dicen nada.
  protected readonly marks = computed(() => {
    const coords = this.coords();
    const points = this.points();
    return coords.filter(
      (_, i) => i === 0 || i === coords.length - 1 || points[i].balance !== points[i - 1].balance,
    );
  });
}
