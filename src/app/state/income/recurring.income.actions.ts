import { Transaction } from 'src/app/models';

export namespace RecurringIncomeActions{
  
  export class SaveRecurringIncomeTransaction {
    static readonly type = '[TransactionsPage] CreateRecurringIncome';
    constructor(public payload: Transaction) {}
  }

}