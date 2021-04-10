import { Injectable } from '@angular/core';
import {
  State,
  Action,
  Selector,
  StateContext,
  createSelector,
  Store,
} from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Expense, ExpenseService } from 'src/app/expense';
import { Transaction, TransactionTypes } from 'src/app/models';
import { AccountActions } from '../account';
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
  constructor(private expenseService: ExpenseService, private store: Store) {}

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
          subcategory: t.subCategory,
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

  @Action(ExpenseActions.ApplyExpenseTransaction)
  applyIncome(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.ApplyExpenseTransaction
  ) {
    ctx.dispatch(new ExpenseActions.SaveExpenseTransaction(action.payload));

    ctx.dispatch(new AccountActions.AdjustAccountBalance({
      accountKey: action.payload.account.key,
      adjustment: action.payload.amount * -1
    }));
  }

  @Action(ExpenseActions.SaveExpenseTransaction)
  saveExpenseTransaction(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.SaveExpenseTransaction
  ) {
    let expense: Expense = {
      amount: action.payload.amount,
      category: {
        image: action.payload.category.image,
        name: action.payload.category.name,
        color: action.payload.category.color,
        subcategories: action.payload.category.subcategories ? action.payload.category.subcategories : []
      },
      date: action.payload.date,
      isApplied: action.payload.applied,
      notes: action.payload.notes,
      subCategory: action.payload.subcategory ? action.payload.subcategory : null,
      fromAccount: action.payload.account,
      key: action.payload.key
    };

    if(action.payload.key){
      const stateExpense: Expense = ctx.getState().expenses.find(i => i.key == action.payload.key);

      if(stateExpense.isApplied){
        // Adjustment in same account
        if(stateExpense.fromAccount.key == expense.fromAccount.key){
          let adjustment: number = stateExpense.amount - expense.amount;

          this.store.dispatch(new AccountActions.AdjustAccountBalance({
            adjustment: adjustment,
            accountKey: expense.fromAccount.key
          }));
        } else { // Adjustment to different account
          this.store.dispatch(new AccountActions.AdjustAccountBalance({
            adjustment: stateExpense.amount,
            accountKey: stateExpense.fromAccount.key
          }));
          this.store.dispatch(new AccountActions.AdjustAccountBalance({
            adjustment: expense.amount * -1,
            accountKey: expense.fromAccount.key
          }));
        }
      }
      
      this.expenseService.update(expense);
    }else{
      this.expenseService.create(expense);
      if(expense.isApplied){
        this.store.dispatch(new AccountActions.AdjustAccountBalance({
          adjustment: expense.amount * -1,
          accountKey: expense.fromAccount.key
        }));
      }
    }
  }
}
