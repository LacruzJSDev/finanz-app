// Superficie pública de la feature. Otras features solo pueden importar de
// aquí, nunca de sus carpetas internas: esto es el contrato, y todo lo que se
// añada aquí es coste que pagan los demás.
export { TransactionsList } from './components/tables/transactions-list/transactions-list';
export {
  CreateTransactionForm,
  type CreateTransactionFormData,
} from './components/forms/create-transaction-form/create-transaction-form';
export {
  UpdateTransactionForm,
  type UpdateTransactionFormData,
} from './components/forms/update-transaction-form/update-transaction-form';
export {
  DeleteTransactionForm,
  type DeleteTransactionFormData,
} from './components/forms/delete-transaction-form/delete-transaction-form';
