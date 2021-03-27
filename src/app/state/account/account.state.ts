import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AccountService, Account } from 'src/app/account';
import { groupBy, map, mergeMap, toArray } from 'rxjs/operators';
import { AccountActions } from './account.actions';
import { AccountGroup } from 'src/app/models';
import { from } from 'rxjs';

export class AccountStateModel {
  public accounts: Account[];
  public accountGroups: AccountGroup[];
}

const defaults = {
  accounts: [],
  accountGroups: []
};

@State<AccountStateModel>({
  name: 'accountState',
  defaults
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService){

  }

  @Selector()
  static selectAccounts(state: AccountStateModel) {
    return state.accounts;
  }

  @Selector()
  static selectAccountGroups(state: AccountStateModel) {
    return state.accountGroups;
  }

  @Action(AccountActions.Get)
  getAllAccounts(context: StateContext<AccountStateModel>){
    this.accountService
      .getAll()
      .pipe(
        map(apiAccounts => {
          let data: Account[] = [];

          apiAccounts.forEach((apiAccount: any) => {
            data.push({
              description: apiAccount.name,
              image: apiAccount.image,
              color: apiAccount.color,
              currentBalance: apiAccount.currentBalance,
              sumsToMonthlyBudget: apiAccount.isSummable,
              accountType: apiAccount.accountType
            });
          });

          return data;
        })
      )
      .subscribe((accs: Account[]) => context.dispatch(new AccountActions.GetSuccess(accs)));
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
