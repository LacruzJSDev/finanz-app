import { Component, computed, input } from '@angular/core';

/**
 * La inicial de alguien sobre un círculo. No hay foto en ningún sitio de la
 * API, así que el nombre es todo lo que hay para identificar a una persona.
 */
@Component({
  selector: 'app-avatar',
  template: '{{ initial() }}',
  styleUrl: './avatar.scss',
})
export class Avatar {
  readonly name = input.required<string>();
  readonly size = input(40);

  protected readonly initial = computed(() => this.name().trim().charAt(0).toUpperCase());
}
