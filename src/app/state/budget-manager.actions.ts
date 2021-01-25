import { Account } from '../account/account';

export class BudgetManagerAction {
  static readonly type = '[BudgetManager] Add item';
  constructor(public payload: Account) { }
}

export namespace AccountActions{
  export class Get {
    static readonly type = '[Dashboard] GetAccounts';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] AccountsLoaded';
    constructor(public payload: Account[]) {}
  }
}