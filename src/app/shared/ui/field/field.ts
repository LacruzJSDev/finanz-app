import { booleanAttribute, Component, input } from '@angular/core';

/** Structural field shell for a native control and its accessible description. */
@Component({
  selector: 'app-field',
  templateUrl: './field.html',
  styleUrl: './field.scss',
  host: {
    '[class.app-field--invalid]': 'error() !== null && error() !== ""',
    '[class.app-field--compact]': 'compact()',
  },
})
export class AppField {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly compact = input(false, { transform: booleanAttribute });

  protected readonly descriptionId = () => `${this.inputId()}-description`;
  protected readonly description = () => this.error() || this.hint() || '';
}
