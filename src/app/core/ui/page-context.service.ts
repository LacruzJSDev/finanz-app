import { Injectable, signal } from '@angular/core';

export interface PageAction {
  icon: string;
  onClick: () => void;
}

@Injectable({ providedIn: 'root' })
export class PageContextService {
  private readonly titleSignal = signal('');
  private readonly actionSignal = signal<PageAction | null>(null);

  readonly title = this.titleSignal.asReadonly();
  readonly action = this.actionSignal.asReadonly();

  setTitle(title: string): void {
    this.titleSignal.set(title);
  }

  setAction(action: PageAction | null): void {
    this.actionSignal.set(action);
  }
}
