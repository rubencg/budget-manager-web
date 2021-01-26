import { Income } from '../../income/';

export namespace IncomeActions{
  export class Get {
    static readonly type = '[Dashboard] GetIncomes';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] IncomesLoaded';
    constructor(public payload: Income[]) {}
  }
}