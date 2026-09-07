import { Injectable, signal } from '@angular/core';

export interface PageAction {
  icon: string;
  onClick: () => void;
}

export interface PageParent {
  label: string;
  url: string;
}

export interface PageTitleOptions {
  /** Lo que la página añade a la línea de contexto: un saldo, por ejemplo. */
  detail?: string | null;

  /**
   * Si la pantalla trabaja dentro del grupo activo. Las que gestionan grupos no:
   * ahí el título ya nombra un grupo, y ver al lado el nombre de otro —el de
   * trabajo— se lee como si los dos fueran el mismo.
   */
  showGroup?: boolean;

  /** Destino explícito para volver desde una pantalla de segundo nivel. */
  parent?: PageParent | null;
}

@Injectable({ providedIn: 'root' })
export class PageContextService {
  private readonly titleSignal = signal('');
  private readonly detailSignal = signal<string | null>(null);
  private readonly showGroupSignal = signal(true);
  private readonly actionSignal = signal<PageAction | null>(null);
  private readonly parentSignal = signal<PageParent | null>(null);

  readonly title = this.titleSignal.asReadonly();
  readonly detail = this.detailSignal.asReadonly();
  readonly showGroup = this.showGroupSignal.asReadonly();
  readonly action = this.actionSignal.asReadonly();
  readonly parent = this.parentSignal.asReadonly();

  // Todo entra por la misma llamada para que nada pueda quedarse colgado de la
  // pantalla anterior: una página que solo pone título borra lo demás sin
  // saberlo, y así el saldo de una cuenta no aparece sobre otra lista.
  setTitle(title: string, options: PageTitleOptions = {}): void {
    this.titleSignal.set(title);
    this.detailSignal.set(options.detail ?? null);
    this.showGroupSignal.set(options.showGroup ?? true);
    this.parentSignal.set(options.parent ?? null);
  }

  setAction(action: PageAction | null): void {
    this.actionSignal.set(action);
  }
}
