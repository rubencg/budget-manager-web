import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AccountService, Account, AccountType } from 'src/app/account';
import { groupBy, map, mergeMap, toArray } from 'rxjs/operators';
import { AccountActions } from './account.actions';
import { AccountGroup } from 'src/app/models';
import { from } from 'rxjs';
import { AdjustBalancePayload } from './models/adjust-balance.payload';
import { patch, updateItem } from '@ngxs/store/operators';

export class AccountStateModel {
  public accounts: Account[];
  public accountGroups: AccountGroup[];
  public accountTypes: AccountType[];
  public archivedAccounts: Account[];
}

const defaults = {
  accounts: [],
  archivedAccounts: [],
  accountGroups: [],
  accountTypes: []
};

@State<AccountStateModel>({
  name: 'accountState',
  defaults
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService){

  }

  /* Selectors */
  
  @Selector()
  static selectAccounts(state: AccountStateModel) {
    return state.accounts;
  }
  
  @Selector()
  static selectAccountGroups(state: AccountStateModel) {
    return state.accountGroups;
  }
  
  @Selector()
  static selectAccountTypes(state: AccountStateModel) {
    return state.accountTypes;
  }
  
  @Selector()
  static selectArchivedAccounts(state: AccountStateModel) {
    return state.archivedAccounts;
  }
  /* End Selectors */

  @Action(AccountActions.SaveAccount)
  saveAccount(context: StateContext<AccountStateModel>,
    action: AccountActions.SaveAccount){
      const account: Account = action.payload;
      // Update 
      if(account.key){
        this.accountService.updateAccount(account);
      } else { // Insert
        this.accountService.createNewAccount(account);
      }
  }

  @Action(AccountActions.ArchiveAccount)
  archiveAccount(context: StateContext<AccountStateModel>,
    action: AccountActions.ArchiveAccount){
      const account: Account = action.payload;
      this.accountService.deleteAccount(account);
      this.accountService.createNewArchivedAccount(account);
  }
  
  @Action(AccountActions.AdjustAccountBalance)
  adjustAccountBalance(context: StateContext<AccountStateModel>,
    action: AccountActions.AdjustAccountBalance){
      const adjustment: AdjustBalancePayload = action.payload;
      const stateAccount: Account = context.getState().accounts.find(i => i.key == adjustment.accountKey);
      let account: Account =  { ... stateAccount};
      account.currentBalance += adjustment.adjustment;

      context.setState(
        patch({
          accounts: updateItem<Account>(t => t.key == account.key, account),
        })
      );

      this.accountService.updateAccount(account);
  }

  @Action(AccountActions.UnarchiveAccount)
  unArchiveAccount(context: StateContext<AccountStateModel>,
    action: AccountActions.UnarchiveAccount){
      const account: Account = action.payload;
      this.accountService.createNewAccount(account);
      this.accountService.deleteArchivedAccount(account);
  }

  @Action(AccountActions.DeleteArchivedAccount)
  deleteArchiveAccount(context: StateContext<AccountStateModel>,
    action: AccountActions.DeleteArchivedAccount){
      const account: Account = action.payload;
      this.accountService.deleteArchivedAccount(account);
  }

  @Action(AccountActions.Get)
  getAllAccounts(context: StateContext<AccountStateModel>){
    this.accountService
      .getAll()
      .subscribe((accs: Account[]) => context.dispatch(new AccountActions.GetSuccess(accs)));
  }

  @Action(AccountActions.GetArchivedAccounts)
  getAllArchivedAccountTypes(context: StateContext<AccountStateModel>){
    this.accountService
      .getAllArchivedAccounts()
      .subscribe((archivedAccounts: Account[]) => context.dispatch(new AccountActions.GetArchivedAccountsSuccess(archivedAccounts)));
  }
  
  @Action(AccountActions.GetTypes)
  getAllAccountTypes(context: StateContext<AccountStateModel>){
    this.accountService
      .getAllTypes()
      .subscribe((types: AccountType[]) => context.dispatch(new AccountActions.GetTypesSuccess(types)));
  }

  @Action(AccountActions.GetTypesSuccess)
  accountTypesLoaded(
    ctx: StateContext<AccountStateModel>,
    action: AccountActions.GetTypesSuccess
  ) {
    const state = ctx.getState();

    // set account groups
    ctx.setState({
      ...state,
      accountTypes: action.payload
    });
  }

  @Action(AccountActions.GetArchivedAccountsSuccess)
  archivedAccountsLoaded(
    ctx: StateContext<AccountStateModel>,
    action: AccountActions.GetArchivedAccountsSuccess
  ) {
    const state = ctx.getState();

    // set account groups
    ctx.setState({
      ...state,
      archivedAccounts: action.payload
    });
  }

  @Action(AccountActions.GetSuccess)
  accountsLoaded(
    ctx: StateContext<AccountStateModel>,
    action: AccountActions.GetSuccess
  ) {
    const state = ctx.getState();

    // set account groups
    let accounts$ = from(action.payload);
    let accountGroups: AccountGroup[] = [];
    let groups$ = accounts$.pipe(
      groupBy(account => account.accountType.name),
      // return each item in group as array
      mergeMap(group => group.pipe(toArray()))
    )
    groups$.subscribe(acctGroup => {
      accountGroups.push({
        accountType: acctGroup[0].accountType,
        accounts: acctGroup,
        balance: acctGroup.reduce((prev, curr) => prev + curr.currentBalance, 0)
      })
    });
    ctx.setState({
      ...state,
      accounts: action.payload,
      accountGroups: accountGroups
    });
  }
}
