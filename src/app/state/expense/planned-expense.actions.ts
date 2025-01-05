import { PlannedExpense } from 'src/app/planned-expense';

export namespace PlannedExpenseActions {
  export class Get {
    static readonly type = '[Dashboard] GetPlannedExpenses';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] PlannedExpensesLoaded';
    constructor(public payload: PlannedExpense[]) {}
  }

  export class SavePlannedExpense {
    static readonly type = '[TransactionsPage] CreatePlannedExpense';
    constructor(public payload: PlannedExpense) {}
  }

  export class DeletePlannedExpense {
    static readonly type = '[TransactionsPage] DeletePlannedExpense';
    constructor(public payload: PlannedExpense) {}
  }
}
