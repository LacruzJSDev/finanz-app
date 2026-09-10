import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
  inject,
  OnDestroy,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { AppButton } from '../button';
import { AppField } from '../field';
import { AppIcon } from '../icon';

interface CalendarDay {
  date: Date;
  currentMonth: boolean;
  disabled: boolean;
  today: boolean;
}

type DatePickerView = 'day' | 'month' | 'year';

@Component({
  selector: 'app-date-picker',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, AppButton, AppField, AppIcon],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AppDatePicker), multi: true },
  ],
})
export class AppDatePicker implements ControlValueAccessor, OnDestroy {
  readonly label = input('Fecha');
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  protected readonly inputId = `date-picker-${Math.random().toString(36).slice(2)}`;

  protected readonly open = signal(false);
  protected readonly overlayWidth = signal(336);
  protected readonly view = signal<DatePickerView>('day');
  protected readonly selected = signal<Date | null>(null);
  protected readonly month = signal(startOfMonth(new Date()));
  protected readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(this.month()),
  );
  protected readonly monthName = computed(() =>
    new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.month()),
  );
  protected readonly yearLabel = computed(() => String(this.month().getFullYear()));
  protected readonly currentMonthIndex = computed(() => this.month().getMonth());
  protected readonly currentYear = computed(() => this.month().getFullYear());
  protected readonly months = computed(() =>
    Array.from({ length: 12 }, (_, index) => ({
      index,
      label: new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(
        new Date(this.month().getFullYear(), index, 1),
      ),
      disabled: !this.monthHasAllowedDays(this.month().getFullYear(), index),
    })),
  );
  protected readonly years = computed(() => {
    const start = this.yearBlockStart(this.month().getFullYear());
    return Array.from({ length: 12 }, (_, index) => {
      const year = start + index;
      return { year, disabled: !this.yearHasAllowedDays(year) };
    });
  });
  protected readonly days = computed(() => {
    const month = this.month();
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        date,
        currentMonth: date.getMonth() === month.getMonth(),
        disabled: !this.allowed(date),
        today: sameDate(date, new Date()),
      };
    });
  });
  protected readonly rows = computed(() => {
    const days = this.days();
    return Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  });
  protected readonly activeIndex = signal(0);
  protected readonly activeMonthIndex = signal(0);
  protected readonly activeYearIndex = signal(0);
  protected readonly overlayPositions: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
  ];
  protected disabled = false;
  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;
  @ViewChild('trigger') private trigger?: ElementRef<HTMLButtonElement>;
  @ViewChildren('dayButton') private dayButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('monthButton') private monthButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('yearButton') private yearButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  private focusTrap?: FocusTrap;
  private focusTimer?: ReturnType<typeof setTimeout>;
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private onChange: (value: Date | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected toggle(): void {
    if (this.disabled) return;
    if (this.open()) {
      this.close();
      return;
    }
    this.setActiveDate(this.clampDate(this.selected() ?? new Date()));
    this.view.set('day');
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth || 336;
    this.overlayWidth.set(Math.min(336, Math.max(0, viewportWidth - 16)));
    this.open.set(true);
  }
  protected close(): void {
    if (!this.open()) return;
    this.open.set(false);
    clearTimeout(this.focusTimer);
    this.focusTrap?.destroy();
    this.focusTrap = undefined;
    this.onTouched();
    this.trigger?.nativeElement.focus();
  }
  protected onAttach(): void {
    this.focusTimer = setTimeout(() => {
      if (!this.panel || !this.open()) return;
      this.focusTrap = this.focusTrapFactory.create(this.panel.nativeElement);
      this.focusActiveView();
    });
  }
  protected previousMonth(): void {
    this.moveView(-1, false);
  }
  protected nextMonth(): void {
    this.moveView(1, false);
  }

  protected showMonthView(): void {
    this.activeMonthIndex.set(this.nearestAllowedMonth(this.month().getMonth()));
    this.view.set('month');
    this.focusActiveView();
  }

  protected showYearView(): void {
    const start = this.yearBlockStart(this.month().getFullYear());
    this.activeYearIndex.set(
      this.nearestAllowedYearIndex(this.month().getFullYear() - start, start),
    );
    this.view.set('year');
    this.focusActiveView();
  }

  protected chooseMonth(index: number): void {
    if (this.months()[index]?.disabled) return;
    this.month.set(new Date(this.month().getFullYear(), index, 1));
    this.activeIndex.set(0);
    this.view.set('day');
    this.focusActiveView();
  }

  protected chooseYear(year: number): void {
    if (!this.yearHasAllowedDays(year)) return;
    this.month.set(new Date(year, this.month().getMonth(), 1));
    this.view.set('month');
    this.activeMonthIndex.set(this.nearestAllowedMonth(this.month().getMonth()));
    this.focusActiveView();
  }

  protected onMonthKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.chooseMonth(index);
      return;
    }
    const next = this.gridIndex(event, index, 3, 12);
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      this.moveYear(event.key === 'PageUp' ? -1 : 1);
      return;
    }
    if (next === null) return;
    event.preventDefault();
    this.activeMonthIndex.set(this.nearestAllowedMonth(next));
    this.focusActiveView();
  }

  protected onYearKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.chooseYear(this.years()[index].year);
      return;
    }
    const next = this.gridIndex(event, index, 3, 12);
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      this.moveYear((event.key === 'PageUp' ? -1 : 1) * 12);
      return;
    }
    if (next === null) return;
    event.preventDefault();
    this.activeYearIndex.set(
      this.nearestAllowedYearIndex(next, this.yearBlockStart(this.month().getFullYear())),
    );
    this.focusActiveView();
  }

  protected monthTabIndex(index: number): number {
    return index === this.activeMonthIndex() ? 0 : -1;
  }

  protected yearTabIndex(index: number): number {
    return index === this.activeYearIndex() ? 0 : -1;
  }

  protected canNavigate(direction: -1 | 1): boolean {
    const year = this.month().getFullYear();
    if (this.view() === 'day') {
      const candidate = new Date(year, this.month().getMonth() + direction, 1);
      return this.monthHasAllowedDays(candidate.getFullYear(), candidate.getMonth());
    }
    const offset = this.view() === 'month' ? direction : direction * 12;
    return this.view() === 'year'
      ? this.yearBlockHasAllowedDays(this.yearBlockStart(year) + offset)
      : this.yearHasAllowedDays(year + offset);
  }
  protected choose(day: CalendarDay): void {
    if (this.disabled || !this.allowed(day.date)) return;
    const value = new Date(day.date);
    value.setHours(0, 0, 0, 0);
    this.selected.set(value);
    this.onChange(value);
    this.close();
  }
  protected onDayKeydown(event: KeyboardEvent, index: number): void {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    let next = offsets[event.key];
    if (event.key === 'Home') next = -(index % 7);
    if (event.key === 'End') next = 6 - (index % 7);
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      this.moveMonth((event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1));
      return;
    }
    if (next === undefined) return;
    event.preventDefault();
    const date = new Date(this.days()[index].date);
    date.setDate(date.getDate() + next);
    this.setActiveDate(this.clampDate(date));
    this.focusActiveDay();
  }
  protected dayTabIndex(index: number): number {
    return index === this.activeIndex() ? 0 : -1;
  }
  private focusActiveDay(): void {
    clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => {
      if (this.open()) this.dayButtons?.get(this.activeIndex())?.nativeElement.focus();
    });
  }
  private focusActiveView(): void {
    clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => {
      if (!this.open()) return;
      if (this.view() === 'day') this.dayButtons?.get(this.activeIndex())?.nativeElement.focus();
      if (this.view() === 'month')
        this.monthButtons?.get(this.activeMonthIndex())?.nativeElement.focus();
      if (this.view() === 'year')
        this.yearButtons?.get(this.activeYearIndex())?.nativeElement.focus();
    });
  }
  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }
  private clampDate(date: Date): Date {
    const min = this.min();
    const max = this.max();
    if (min && date < startOfDay(min)) return startOfDay(min);
    if (max && date > startOfDay(max)) return startOfDay(max);
    return startOfDay(date);
  }
  private setActiveDate(date: Date): void {
    this.month.set(startOfMonth(date));
    this.activeIndex.set(
      Math.max(
        0,
        this.days().findIndex((day) => sameDate(day.date, date)),
      ),
    );
  }
  private moveMonth(offset: number, focus = true): void {
    const active = this.days()[this.activeIndex()].date;
    const lastDay = new Date(active.getFullYear(), active.getMonth() + offset + 1, 0).getDate();
    this.setActiveDate(
      this.clampDate(
        new Date(
          active.getFullYear(),
          active.getMonth() + offset,
          Math.min(active.getDate(), lastDay),
        ),
      ),
    );
    if (focus) this.focusActiveDay();
  }
  private moveView(offset: number, focus = true): void {
    if (this.view() === 'day') {
      this.moveMonth(offset, focus);
      return;
    }
    if (this.view() === 'month') {
      this.moveYear(offset);
      return;
    }
    this.moveYear(offset * 12);
  }
  private moveYear(offset: number): void {
    const nextYear = this.month().getFullYear() + offset;
    if (this.view() === 'year' && !this.yearBlockHasAllowedDays(this.yearBlockStart(nextYear)))
      return;
    if (this.view() === 'month' && !this.yearHasAllowedDays(nextYear)) return;
    const targetYear =
      this.view() === 'year' ? this.nearestAllowedYear(this.yearBlockStart(nextYear)) : nextYear;
    this.month.set(new Date(targetYear, this.month().getMonth(), 1));
    this.activeMonthIndex.set(this.nearestAllowedMonth(this.month().getMonth()));
    this.activeYearIndex.set(
      this.nearestAllowedYearIndex(
        this.month().getFullYear() - this.yearBlockStart(this.month().getFullYear()),
        this.yearBlockStart(this.month().getFullYear()),
      ),
    );
    this.focusActiveView();
  }
  private gridIndex(
    event: KeyboardEvent,
    index: number,
    columns: number,
    length: number,
  ): number | null {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
      Home: -(index % columns),
      End: columns - 1 - (index % columns),
    };
    if (!(event.key in offsets)) return null;
    return Math.max(0, Math.min(length - 1, index + offsets[event.key]));
  }
  private yearBlockStart(year: number): number {
    return year - (year % 12);
  }
  private monthHasAllowedDays(year: number, month: number): boolean {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, index) =>
      this.allowed(new Date(year, month, index + 1)),
    ).some(Boolean);
  }
  private yearHasAllowedDays(year: number): boolean {
    return Array.from({ length: 12 }, (_, month) => this.monthHasAllowedDays(year, month)).some(
      Boolean,
    );
  }
  private yearBlockHasAllowedDays(start: number): boolean {
    return Array.from({ length: 12 }, (_, index) => this.yearHasAllowedDays(start + index)).some(
      Boolean,
    );
  }
  private nearestAllowedMonth(preferred: number): number {
    const available = this.months().filter((month) => !month.disabled);
    return (
      available.sort((a, b) => Math.abs(a.index - preferred) - Math.abs(b.index - preferred))[0]
        ?.index ?? preferred
    );
  }
  private nearestAllowedYearIndex(preferred: number, start: number): number {
    const available = this.years().filter((year) => !year.disabled);
    const nearest = available.sort(
      (a, b) => Math.abs(a.year - (start + preferred)) - Math.abs(b.year - (start + preferred)),
    )[0];
    return nearest ? nearest.year - start : preferred;
  }
  private nearestAllowedYear(start: number): number {
    return (
      Array.from({ length: 12 }, (_, index) => start + index).find((year) =>
        this.yearHasAllowedDays(year),
      ) ?? start
    );
  }
  ngOnDestroy(): void {
    clearTimeout(this.focusTimer);
    this.focusTrap?.destroy();
  }
  protected displayValue(): string {
    const value = this.selected();
    return value ? new Intl.DateTimeFormat('es-ES').format(value) : '';
  }
  protected fullDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(date);
  }
  protected clear(): void {
    if (this.disabled) return;
    this.selected.set(null);
    this.onChange(null);
    this.close();
  }
  protected allowed(date: Date): boolean {
    return (
      (!this.min() || date >= startOfDay(this.min()!)) &&
      (!this.max() || date <= startOfDay(this.max()!))
    );
  }
  protected isSelected(date: Date): boolean {
    const value = this.selected();
    return !!value && sameDate(value, date);
  }

  writeValue(value: Date | null): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      this.selected.set(null);
      return;
    }
    this.selected.set(new Date(value));
    this.month.set(startOfMonth(value));
  }
  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled && this.open()) this.close();
  }
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function sameDate(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}
