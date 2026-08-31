import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { of } from 'rxjs';
import { describe, beforeEach, expect, it } from 'vitest';
import { TransactionRead, UpdateTransactionRequest } from '../../../../../core/models';
import { TransactionsService } from '../../../../../core/transactions/transactions.service';
import { UpdateTransactionForm, UpdateTransactionFormData } from './update-transaction-form';

const transaccion = {
  id: 't1',
  account_id: 'a1',
  category_id: 'cat-1',
  to_account_id: null,
  type: 'expense',
  amount: -500,
  date: '2026-08-31',
  notes: 'Cena',
} as unknown as TransactionRead;

/** Recoge lo que el formulario manda, tal cual viaja por el cuerpo. */
class ServicioFalso {
  enviado?: UpdateTransactionRequest;
  updateTransaction(_accountId: string, _id: string, payload: UpdateTransactionRequest) {
    this.enviado = JSON.parse(JSON.stringify(payload));
    return of({} as TransactionRead);
  }
}

describe('UpdateTransactionForm, lo que manda al guardar', () => {
  let servicio: ServicioFalso;
  let form: UpdateTransactionForm;

  beforeEach(() => {
    servicio = new ServicioFalso();
    const data: UpdateTransactionFormData = {
      accountId: 'a1',
      transaction: transaccion,
      otherAccounts: [],
      categories: [{ id: 'cat-1', name: 'Cena' }] as never,
    };
    TestBed.configureTestingModule({
      providers: [
        provideNativeDateAdapter(),
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: data },
        { provide: MatBottomSheetRef, useValue: { dismiss: () => undefined, disableClose: false } },
        { provide: TransactionsService, useValue: servicio },
      ],
    });
    form = TestBed.createComponent(UpdateTransactionForm).componentInstance;
  });

  it('quitar la categoría la manda como null, no la omite', () => {
    form.form.controls.category_id.setValue('');
    form.submit();

    expect(servicio.enviado).toBeDefined();
    expect('category_id' in servicio.enviado!).toBe(true);
    expect(servicio.enviado!.category_id).toBe(null);
  });

  it('vaciar el concepto también viaja', () => {
    form.form.controls.notes.setValue('');
    form.submit();

    expect('notes' in servicio.enviado!).toBe(true);
    expect(servicio.enviado!.notes).toBe(null);
  });

  it('con categoría elegida, la manda', () => {
    form.submit();
    expect(servicio.enviado!.category_id).toBe('cat-1');
  });
});
