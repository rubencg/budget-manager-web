import { Transaction } from 'src/app/models';

export namespace RecurringExpenseActions{
  
  export class SaveRecurringExpenseTransaction {
    static readonly type = '[TransactionsPage] CreateRecurringExpense';
    constructor(public payload: Transaction) {}
  }

}