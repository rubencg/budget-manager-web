import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, createSelector, Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Account } from 'src/app/account';
import { Income, IncomeService } from 'src/app/income';
import { Transaction, TransactionTypes } from 'src/app/models';
import { AccountActions } from '../account';
import { IncomeActions } from './income.actions';

export interface IncomeStateModel {
  incomes: Income[];
  transactions: Transaction[];
}

@State<IncomeStateModel>({
  name: 'incomeState',
  defaults: {
    incomes: [],
    transactions: [],
  },
})
@Injectable()
export class IncomeState {
  constructor(private incomeService: IncomeService, private store: Store) {}

  static selectTransactionsForMonth(date: Date) {
    return createSelector([IncomeState], (state: IncomeStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  @Action(IncomeActions.Get)
  getAllIncomes(context: StateContext<IncomeStateModel>) {
    this.incomeService
      .getAll()
      .subscribe((inputIncomes: Income[]) =>
        {
          let incomes: Income[] = [];
          inputIncomes.forEach((t) => {
            incomes.push({
              amount: t.amount,
              date: new Date(t.date),
              toAccount: t.toAccount,
              category: t.category,
              subCategory: t.subCategory,
              isApplied: t.isApplied,
              key: t.key,
              notes: t.notes,
            });
          });
          context.dispatch(new IncomeActions.GetSuccess(incomes));
          
          let transactions: Transaction[] = [];
          incomes.forEach((t) => {
            transactions.push({
              category: t.category,
              applied: t.isApplied,
              amount: t.amount,
              date: new Date(t.date),
              account: t.toAccount,
              subcategory: t.subCategory,
              key: t.key,
              notes: t.notes,
              type: TransactionTypes.Income,
            });
          });
          context.dispatch(new IncomeActions.GetTransactionsSuccess(transactions));
        }
      );
  }

  @Action(IncomeActions.GetSuccess)
  incomesLoaded(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      incomes: action.payload,
    });
  }

  @Action(IncomeActions.GetTransactionsSuccess)
  transactionsLoaded(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.GetTransactionsSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      transactions: action.payload,
    });
  }
  
  @Action(IncomeActions.SaveIncomeTransaction)
  saveIncomeTransaction(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.SaveIncomeTransaction
  ) {
    let income: Income = {
      amount: action.payload.amount,
      category: {
        image: action.payload.category.image,
        name: action.payload.category.name,
        color: action.payload.category.color,
        subcategories: action.payload.category.subcategories
      },
      date: action.payload.date,
      isApplied: action.payload.applied,
      notes: action.payload.notes,
      subCategory: action.payload.subcategory,
      toAccount: action.payload.account,
    };

    this.incomeService.create(income);

    if(income.isApplied){
      let account: Account =  { ... income.toAccount};
      account.currentBalance += income.amount;
  
      this.store.dispatch(new AccountActions.SaveAccount(account));
    }

  }
}
