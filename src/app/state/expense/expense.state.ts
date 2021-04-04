import { Injectable } from '@angular/core';
import {
  State,
  Action,
  Selector,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Expense, ExpenseService } from 'src/app/expense';
import { Transaction, TransactionTypes } from 'src/app/models';
import { ExpenseActions } from './expense.actions';

export interface ExpenseStateModel {
  expenses: Expense[];
  transactions: Transaction[];
}

@State<ExpenseStateModel>({
  name: 'expenseState',
  defaults: {
    expenses: [],
    transactions: [],
  },
})
@Injectable()
export class ExpenseState {
  constructor(private expenseService: ExpenseService) {}

  static selectTransactionsForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  @Action(ExpenseActions.Get)
  getAllExpenses(context: StateContext<ExpenseStateModel>) {
    this.expenseService.getAll().subscribe((inputExpenses: Expense[]) => {
      let expenses: Expense[] = [];
      inputExpenses.forEach((t) => {
        expenses.push({
          amount: t.amount,
          date: new Date(t.date),
          fromAccount: t.fromAccount,
          category: t.category,
          subCategory: t.subCategory,
          isApplied: t.isApplied,
          key: t.key,
          notes: t.notes,
        });
      });
      context.dispatch(new ExpenseActions.GetSuccess(expenses));

      let transactions: Transaction[] = [];
      expenses.forEach((t) => {
        transactions.push({
          category: t.category,
          applied: t.isApplied,
          amount: t.amount,
          date: new Date(t.date),
          account: t.fromAccount,
          key: t.key,
          notes: t.notes,
          type: TransactionTypes.Expense,
        });
      });
      context.dispatch(new ExpenseActions.GetTransactionsSuccess(transactions));
    });
  }

  @Action(ExpenseActions.GetSuccess)
  expensesLoaded(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      expenses: action.payload,
    });
  }

  @Action(ExpenseActions.GetTransactionsSuccess)
  transactionsLoaded(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.GetTransactionsSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      transactions: action.payload,
    });
  }
}
