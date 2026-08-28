import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

// El contenedor que scrollea, que casi nunca es la ventana: en esta aplicación
// el scroll vive en .page-content. Lo que queda fuera de un elemento con
// overflow no intersecta con la ventana por mucho margen que se pida, así que
// sin encontrarlo el adelanto no funcionaría.
function scrollParent(element: HTMLElement): HTMLElement | null {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
  }
  return null;
}

/**
 * Avisa cuando el elemento que la lleva se acerca a la pantalla. Se pone como
 * centinela al final de una lista para pedir la página siguiente.
 */
@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScroll {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  /** A true no avisa: o no queda nada que pedir, o ya se está pidiendo. */
  readonly disabled = input(false);

  /** Cuánto antes del final avisa, para que la página llegue sin frenar el scroll. */
  readonly rootMargin = input('300px');

  readonly reached = output<void>();

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const target = this.element.nativeElement;
      this.observer = new IntersectionObserver(
        (entries) => {
          if (!this.disabled() && entries.some((entry) => entry.isIntersecting)) {
            this.reached.emit();
          }
        },
        { root: scrollParent(target), rootMargin: this.rootMargin() },
      );
      this.observer.observe(target);
      destroyRef.onDestroy(() => this.observer?.disconnect());
    });

    // Si la página que acaba de llegar no llena el contenedor, el centinela
    // sigue a la vista y el observador no vuelve a disparar por sí solo: solo
    // avisa de los cambios. Re-observar fuerza a que entregue el estado actual.
    effect(() => {
      if (this.disabled() || !this.observer) return;
      const target = this.element.nativeElement;
      this.observer.unobserve(target);
      this.observer.observe(target);
    });
  }
}
