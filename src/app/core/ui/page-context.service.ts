import { Injectable, signal } from '@angular/core';

export interface PageAction {
  icon: string;
  onClick: () => void;
}

@Injectable({ providedIn: 'root' })
export class PageContextService {
  private readonly titleSignal = signal('');
  private readonly subtitleSignal = signal<string | null>(null);
  private readonly actionSignal = signal<PageAction | null>(null);

  readonly title = this.titleSignal.asReadonly();
  readonly subtitle = this.subtitleSignal.asReadonly();
  readonly action = this.actionSignal.asReadonly();

  setTitle(title: string, subtitle: string | null = null): void {
    this.titleSignal.set(title);
    this.subtitleSignal.set(subtitle);
  }

  setAction(action: PageAction | null): void {
    this.actionSignal.set(action);
  }
}
