import { Transaction } from 'src/app/models';
import { MonthlyIncome } from '../../income/';

export namespace MonthlyIncomeActions{
  export class Get {
    static readonly type = '[Dashboard] GetMonthlyIncomes';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] MonthlyIncomesLoaded';
    constructor(public payload: MonthlyIncome[]) {}
  }

  export class SaveMonthlyIncomeTransaction {
    static readonly type = '[TransactionsPage] CreateMonthlyIncome';
    constructor(public payload: Transaction) {}
  }
  
  export class DeleteMonthlyIncome {
    static readonly type = '[TransactionsPage] DeleteMonthlyIncome';
    constructor(public payload: Transaction) {}
  }
}