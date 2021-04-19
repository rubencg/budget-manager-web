import { DashboardAccount } from "src/app/account";


export namespace DashboardAccountActions{
  
  export class Get {
    static readonly type = '[Dashboard] GetDashboardAccounts';
    constructor() {}
  }
  
  export class GetSuccess {
    static readonly type = '[Firebase] DashboardAccountsLoaded';
    constructor(public payload: DashboardAccount[]) {}
  }

  export class SaveDashboardAccounts {
    static readonly type = '[ProfilePage] SaveDashboardAccounts';
    constructor(public payload: DashboardAccount[]) {}
  }
  
}