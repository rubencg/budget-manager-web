import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AccountService } from 'src/app/account/account.service';
import { AccountActions, BudgetManagerAction } from './budget-manager.actions';
import { Account } from '../account/account';
import { map } from 'rxjs/operators';

export class BudgetManagerStateModel {
  public accounts: Account[];
}

const defaults = {
  accounts: []
};

@State<BudgetManagerStateModel>({
  name: 'budgetManager',
  defaults
})
@Injectable()
export class BudgetManagerState {

  constructor(private accountService: AccountService){

  }

  @Selector()
  static selectAccounts(state: BudgetManagerStateModel) {
    return state.accounts;
  }
  
  @Action(AccountActions.Get)
  getAllAccounts(context: StateContext<BudgetManagerStateModel>){
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
  usersLoaded(
    ctx: StateContext<BudgetManagerStateModel>,
    action: AccountActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      accounts: action.payload,
    });
  }
}
