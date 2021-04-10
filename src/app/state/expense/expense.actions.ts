import { Transaction } from 'src/app/models';
import { Expense } from '../../expense/';

export namespace ExpenseActions{
  export class Get {
    static readonly type = '[Dashboard] GetExpenses';
    constructor() {}
  }

  export class GetTransactionsSuccess {
    static readonly type = '[Firebase] ExpenseTransactionsLoaded';
    constructor(public payload: Transaction[]) {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] ExpensesLoaded';
    constructor(public payload: Expense[]) {}
  }
  
  export class SaveExpenseTransaction {
    static readonly type = '[TransactionsPage] CreateExpense';
    constructor(public payload: Transaction) {}
  }

  export class ApplyExpenseTransaction {
    static readonly type = '[TransactionsPage] ApplyExpense';
    constructor(public payload: Transaction) {}
  }
}