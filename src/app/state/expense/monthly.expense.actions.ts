import { Transaction } from 'src/app/models';
import { MonthlyExpense } from '../../expense';

export namespace MonthlyExpenseActions{
  export class Get {
    static readonly type = '[Dashboard] GetMonthlyExpenses';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] MonthlyExpensesLoaded';
    constructor(public payload: MonthlyExpense[]) {}
  }

  export class SaveMonthlyExpenseTransaction {
    static readonly type = '[TransactionsPage] CreateMonthlyExpense';
    constructor(public payload: Transaction) {}
  }

  export class SaveMonthlyExpense {
    static readonly type = '[TransactionsPage] CreateMonthlyExpenseFromMonthlyExpense';
    constructor(public payload: MonthlyExpense) {}
  }
  
  export class DeleteMonthlyExpense {
    static readonly type = '[TransactionsPage] DeleteMonthlyExpense';
    constructor(public payload: Transaction) {}
  }
}