import { InjectionToken, Type } from '@angular/core';
import { AppSheetRef } from './app-sheet-ref';

export const APP_SHEET_DATA = new InjectionToken<unknown>('APP_SHEET_DATA');

export interface AppSheetConfigData {
  component: Type<unknown>;
  data?: unknown;
  ref: AppSheetRef;
}

export const APP_SHEET_CONFIG = new InjectionToken<AppSheetConfigData>('APP_SHEET_CONFIG');
