import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, createSelector } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Income, IncomeService } from 'src/app/income';
import { Transaction, TransactionTypes } from 'src/app/models';
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
  constructor(private incomeService: IncomeService) {}

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
  TransactionsLoaded(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.GetTransactionsSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      transactions: action.payload,
    });
  }
}
