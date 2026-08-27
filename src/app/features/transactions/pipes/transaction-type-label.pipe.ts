import { Pipe, PipeTransform } from '@angular/core';
import { TransactionTypeEnum } from '../../../core/models';

const TRANSACTION_TYPE_LABELS: Record<TransactionTypeEnum, string> = {
  [TransactionTypeEnum.Income]: 'Ingreso',
  [TransactionTypeEnum.Expense]: 'Gasto',
  [TransactionTypeEnum.Transfer]: 'Transferencia',
};

@Pipe({ name: 'transactionTypeLabel' })
export class TransactionTypeLabelPipe implements PipeTransform {
  transform(type: TransactionTypeEnum): string {
    return TRANSACTION_TYPE_LABELS[type];
  }
}
