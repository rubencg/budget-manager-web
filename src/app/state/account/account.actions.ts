import { Account } from '../../account';

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