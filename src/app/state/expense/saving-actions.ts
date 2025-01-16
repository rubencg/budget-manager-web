import { Saving, SavingAmount } from 'src/app/saving';

export namespace SavingActions {
  export class Get {
    static readonly type = '[Dashboard] GetSavings';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] SavingsLoaded';
    constructor(public payload: Saving[]) {}
  }

  export class SaveSaving {
    static readonly type = '[TransactionsPage] CreateSaving';
    constructor(public payload: Saving) {}
  }

  export class UpdateSavingAmount{
    static readonly type = '[TransactionsPage] UpdateSavingAmount';
    constructor(public payload: SavingAmount) {}
  }

  export class DeleteSaving {
    static readonly type = '[TransactionsPage] DeleteSaving';
    constructor(public payload: Saving) {}
  }
}
