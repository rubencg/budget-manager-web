import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AccountService, Account } from 'src/app/account';
import { map } from 'rxjs/operators';
import { AccountActions } from './account.actions';

export class AccountStateModel {
  public accounts: Account[];
}

const defaults = {
  accounts: []
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
              image: apiAccount.img,
              currentBalance: apiAccount.currentBalance,
              sumsToMonthlyBudget: apiAccount.isSummable,
              accountType: {
                name: 'Debito'
              }
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
    ctx.setState({
      ...state,
      accounts: action.payload,
    });
  }
}
