import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
})
export class Paginator {
  readonly total = input.required<number>();
  readonly limit = input.required<number>();
  readonly offset = input.required<number>();

  readonly pageChange = output<number>(); // emite el nuevo offset

  protected readonly hasPrevious = computed(() => this.offset() > 0);
  protected readonly hasNext = computed(() => this.offset() + this.limit() < this.total());

  previous(): void {
    this.pageChange.emit(Math.max(0, this.offset() - this.limit()));
  }

  next(): void {
    this.pageChange.emit(this.offset() + this.limit());
  }
}
