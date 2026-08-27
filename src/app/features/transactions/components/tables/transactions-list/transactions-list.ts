import { Component, input, output } from '@angular/core';
import { CategoryRead, TransactionRead } from '../../../../../core/models';
import { CentsToEurosPipe } from '../../../../../shared/money/cents-to-euros.pipe';
import { TransactionTypeLabelPipe } from '../../../pipes/transaction-type-label.pipe';
import { CategoryNamePipe } from '../../../pipes/category-name.pipe';

@Component({
  selector: 'app-transactions-list',
  imports: [CentsToEurosPipe, TransactionTypeLabelPipe, CategoryNamePipe],
  templateUrl: 'transactions-list.html',
})
export class TransactionsList {
  readonly transactions = input.required<TransactionRead[]>();
  readonly categories = input.required<CategoryRead[]>();

  readonly rowClick = output<TransactionRead>();
  readonly deleteClick = output<TransactionRead>();
}
