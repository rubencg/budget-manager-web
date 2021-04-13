import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  createSelector,
  Store,
} from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Expense, ExpenseService, MonthlyExpense, MonthlyExpenseService } from 'src/app/expense';
import { Transaction, TransactionTypes } from 'src/app/models';
import { AccountActions } from '../account';
import { ExpenseActions } from './expense.actions';
import { MonthlyExpenseActions } from './monthly.expense.actions';

export interface ExpenseStateModel {
  expenses: Expense[];
  monthlyExpenses: MonthlyExpense[];
  transactions: Transaction[];
}

@State<ExpenseStateModel>({
  name: 'expenseState',
  defaults: {
    expenses: [],
    monthlyExpenses: [],
    transactions: [],
  },
})
@Injectable()
export class ExpenseState {
  constructor(private expenseService: ExpenseService, private store: Store,
    private monthlyExpenseService: MonthlyExpenseService) {}

  static selectTransactionsForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  static selectMonthlyExpenseTransactionsForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) => {
      let monthlyExpenseTransactions: Transaction[] = [];

      state.monthlyExpenses.forEach((monthlyExpense: MonthlyExpense) => {
        const filteredExpense = state.expenses.find(
          (i) => i.monthlyKey == monthlyExpense.key
        );

        if (!filteredExpense) {
          monthlyExpenseTransactions.push({
            amount: monthlyExpense.amount,
            date: new Date(
              date.getFullYear(),
              date.getMonth(),
              monthlyExpense.day
            ),
            account: monthlyExpense.fromAccount,
            category: monthlyExpense.category,
            subcategory: monthlyExpense.subCategory,
            key: monthlyExpense.key,
            notes: monthlyExpense.notes,
            type: TransactionTypes.MonthlyExpense,
          });
        }
      });
      return monthlyExpenseTransactions;
    });
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
          monthlyKey: t.monthlyKey
        });
      });
      context.dispatch(new ExpenseActions.GetSuccess(expenses));

      let transactions: Transaction[] = [];
      expenses.forEach((e) => {
        transactions.push(this.getTransactionFromExpense(e));
      });
      context.dispatch(new ExpenseActions.GetTransactionsSuccess(transactions));
    });
  }

  private getTransactionFromExpense(expense: Expense): Transaction {
    return {
      category: expense.category,
      applied: expense.isApplied,
      amount: expense.amount,
      date: new Date(expense.date),
      account: expense.fromAccount,
      subcategory: expense.subCategory,
      monthlyKey: expense.monthlyKey,
      key: expense.key,
      notes: expense.notes,
      type: TransactionTypes.Expense,
    };
  }

  private getExpenseFromTransaction(transaction: Transaction): Expense {
    return this.getExpenseFromTransactionAndDate(transaction, transaction.date);
  }

  private getExpenseFromTransactionAndDate(
    transaction: Transaction,
    date: Date
  ): Expense {
    return {
      amount: transaction.amount,
      category: {
        image: transaction.category.image,
        name: transaction.category.name,
        color: transaction.category.color,
        subcategories: transaction.category.subcategories
          ? transaction.category.subcategories
          : [],
      },
      date: date,
      isApplied: transaction.applied,
      notes: transaction.notes,
      subCategory: transaction.subcategory ? transaction.subcategory : null,
      fromAccount: transaction.account,
      key: transaction.monthlyKey ? null : transaction.key,
      monthlyKey: transaction.monthlyKey ? transaction.monthlyKey : null,
    };
  }

  /* Monthly Expense Categories */
  @Action(MonthlyExpenseActions.Get)
  getAllMonthlyExpense(context: StateContext<ExpenseStateModel>) {
    this.monthlyExpenseService
      .getAll()
      .subscribe((monthlyExpenses: MonthlyExpense[]) =>
        context.dispatch(new MonthlyExpenseActions.GetSuccess(monthlyExpenses))
      );
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

  @Action(MonthlyExpenseActions.GetSuccess)
  monthlyExpensesLoaded(
    ctx: StateContext<ExpenseStateModel>,
    action: MonthlyExpenseActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      monthlyExpenses: action.payload,
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

  @Action(MonthlyExpenseActions.DeleteMonthlyExpense)
  deleteMonthlyExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: MonthlyExpenseActions.DeleteMonthlyExpense
  ) {
    this.monthlyExpenseService.delete(action.payload.key);
  }

  @Action(ExpenseActions.ApplyExpenseTransaction)
  applyExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.ApplyExpenseTransaction
  ) {
    ctx.dispatch(new ExpenseActions.SaveExpenseTransaction(action.payload));

    ctx.dispatch(new AccountActions.AdjustAccountBalance({
      accountKey: action.payload.account.key,
      adjustment: action.payload.amount * -1
    }));
  }

  @Action(ExpenseActions.DeleteExpense)
  deleteExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.DeleteExpense
  ) {
    this.expenseService.delete(action.payload.key);

    ctx.setState(
      patch({
        transactions: removeItem<Transaction>(
          (t) => t.key == action.payload.key
        ),
        expenses: removeItem<Expense>((t) => t.key == action.payload.key),
      })
    );
    
    if(action.payload.applied){
      ctx.dispatch(new AccountActions.AdjustAccountBalance({
        accountKey: action.payload.account.key,
        adjustment: action.payload.amount
      }));
    }
  }

  @Action(ExpenseActions.SaveExpenseTransaction)
  saveExpenseTransaction(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.SaveExpenseTransaction
  ) {
    let expense: Expense = this.getExpenseFromTransaction(action.payload);

    if(action.payload.key && action.payload.type == TransactionTypes.Expense){
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

      ctx.setState(
        patch({
          transactions: updateItem<Transaction>(t => t.key == action.payload.key, action.payload),
        })
      );
      
      this.expenseService.update(expense);
    }else{
      this.expenseService.create(expense).then((r) => {
        let t: Transaction = this.getTransactionFromExpense(expense);
        t.key = r.key;

        if (action.payload.type == TransactionTypes.MonthlyExpense) {
          ctx.setState(
            patch({
              transactions: append([t]),
            })
          );
        }
      });

      if(expense.isApplied){
        this.store.dispatch(new AccountActions.AdjustAccountBalance({
          adjustment: expense.amount * -1,
          accountKey: expense.fromAccount.key
        }));
      }
    }
  }

  @Action(MonthlyExpenseActions.SaveMonthlyExpenseTransaction)
  saveMonthlyExpenseTransaction(
    ctx: StateContext<ExpenseStateModel>,
    action: MonthlyExpenseActions.SaveMonthlyExpenseTransaction
  ) {
    let monthlyExpense: MonthlyExpense = {
      amount: action.payload.amount,
      category: {
        image: action.payload.category.image,
        name: action.payload.category.name,
        color: action.payload.category.color,
        subcategories: action.payload.category.subcategories
          ? action.payload.category.subcategories
          : [],
      },
      day: action.payload.date.getDate(),
      notes: action.payload.notes,
      subCategory: action.payload.subcategory
        ? action.payload.subcategory
        : null,
      fromAccount: action.payload.account,
      key: action.payload.key,
    };

    if (monthlyExpense.key) {
      this.monthlyExpenseService.update(monthlyExpense);
    } else {
      this.monthlyExpenseService.create(monthlyExpense);
    }
  }
}
