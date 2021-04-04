import { Transaction } from 'src/app/models';
import { Income } from '../../income/';

export namespace IncomeActions{
  export class Get {
    static readonly type = '[Dashboard] GetIncomes';
    constructor() {}
  }

  export class GetTransactionsSuccess {
    static readonly type = '[Firebase] IncomeTransactionsLoaded';
    constructor(public payload: Transaction[]) {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] IncomesLoaded';
    constructor(public payload: Income[]) {}
  }

  export class SaveIncomeTransaction {
    static readonly type = '[TransactionsPage] IncomeCreated';
    constructor(public payload: Transaction) {}
  }
}