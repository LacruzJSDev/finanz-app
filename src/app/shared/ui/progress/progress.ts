import { Component, computed, input, numberAttribute } from '@angular/core';

/** A determinate progress indicator with no dependency on native browser UI. */
@Component({
  selector: 'app-progress',
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class AppProgress {
  readonly value = input(0, { transform: numberAttribute });
  readonly label = input('Progreso');
  readonly clampedValue = computed(() => Math.min(100, Math.max(0, Number(this.value()) || 0)));
}
