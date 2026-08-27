import { Pipe, PipeTransform } from '@angular/core';
import { AccountTypeEnum } from '../../../core/models';

const ACCOUNT_TYPE_LABELS: Record<AccountTypeEnum, string> = {
  [AccountTypeEnum.Cash]: 'Efectivo',
  [AccountTypeEnum.Bank]: 'Cuenta bancaria',
  [AccountTypeEnum.CreditCard]: 'Tarjeta de crédito',
  [AccountTypeEnum.Savings]: 'Ahorros',
  [AccountTypeEnum.Investment]: 'Inversión',
  [AccountTypeEnum.Other]: 'Otro',
};

@Pipe({ name: 'accountTypeLabel' })
export class AccountTypeLabelPipe implements PipeTransform {
  transform(type: AccountTypeEnum): string {
    return ACCOUNT_TYPE_LABELS[type];
  }
}
