import { AdjustBalancePayload } from '.';
import { Account, AccountType } from '../../account';

export namespace AccountActions{
  /* Account actions */
  export class Get {
    static readonly type = '[Dashboard] GetAccounts';
    constructor() {}
  }
  
  export class GetSuccess {
    static readonly type = '[Firebase] AccountsLoaded';
    constructor(public payload: Account[]) {}
  }
  
  export class SaveAccount {
    static readonly type = '[Accounts Page] SaveAccount';
    constructor(public payload: Account) {}
  }
  
  export class AdjustAccountBalance {
    static readonly type = '[Accounts Page] SaveAccount';
    constructor(public payload: AdjustBalancePayload) {}
  }

  export class ArchiveAccount {
    static readonly type = '[Accounts Page] ArchiveAccount';
    constructor(public payload: Account) {}
  }
  /* End Account actions */
  
  /* Archive actions */
  export class UnarchiveAccount {
    static readonly type = '[Accounts Page] UnarchiveAccount';
    constructor(public payload: Account) {}
  }

  export class DeleteArchivedAccount {
    static readonly type = '[Archived Accounts Page] DeleteArchiveAccount';
    constructor(public payload: Account) {}
  }

  export class GetArchivedAccounts {
    static readonly type = '[Archived Accounts Page] GetArchivedAccounts';
    constructor() {}
  }
  
  export class GetArchivedAccountsSuccess {
    static readonly type = '[Archived Accounts Page] ArchivedAccountsLoaded';
    constructor(public payload: Account[]) {}
  }
  /* Ends Archive actions */

  /* Action Type actions */
  export class GetTypes {
    static readonly type = '[Dashboard] GetAccountTypes';
    constructor() {}
  }
  
  export class GetTypesSuccess {
    static readonly type = '[Firebase] AccountTypesLoaded';
    constructor(public payload: AccountType[]) {}
  }
  /* Ends Action Type actions */
}