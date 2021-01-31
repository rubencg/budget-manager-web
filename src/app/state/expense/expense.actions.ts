import { Expense } from '../../expense/';

export namespace ExpenseActions{
  export class Get {
    static readonly type = '[Dashboard] GetExpenses';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] ExpensesLoaded';
    constructor(public payload: Expense[]) {}
  }
}