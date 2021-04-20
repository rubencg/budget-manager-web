import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  createSelector,
  Store,
} from '@ngxs/store';
import {
  Income,
  IncomeService,
  MonthlyIncome,
  MonthlyIncomeService,
} from 'src/app/income';
import { RecurringTypes, Transaction, TransactionTypes } from 'src/app/models';
import { AccountActions } from '../account';
import { IncomeActions } from './income.actions';
import { MonthlyIncomeActions } from './monthly.income.actions';
import { patch, removeItem, append, updateItem } from '@ngxs/store/operators';
import { RecurringIncomeActions } from './recurring.income.actions';

export interface IncomeStateModel {
  incomes: Income[];
  monthlyIncomes: MonthlyIncome[];
  transactions: Transaction[];
}

@State<IncomeStateModel>({
  name: 'incomeState',
  defaults: {
    incomes: [],
    transactions: [],
    monthlyIncomes: [],
  },
})
@Injectable()
export class IncomeState {
  constructor(
    private incomeService: IncomeService,
    private store: Store,
    private monthlyIncomeService: MonthlyIncomeService
  ) {}

  static selectTransactionsForMonth(date: Date) {
    return createSelector([IncomeState], (state: IncomeStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  static selectMonthlyIncomeTransactionsForMonth(date: Date) {
    return createSelector([IncomeState], (state: IncomeStateModel) => {
      let monthlyIncomeTransactions: Transaction[] = [];

      state.monthlyIncomes.forEach((monthlyIncome: MonthlyIncome) => {
        const filteredIncome = state.incomes.find(
          (i) => i.monthlyKey == monthlyIncome.key
        );

        if (!filteredIncome) {
          monthlyIncomeTransactions.push({
            amount: monthlyIncome.amount,
            date: new Date(
              date.getFullYear(),
              date.getMonth(),
              monthlyIncome.day
            ),
            account: monthlyIncome.toAccount,
            category: monthlyIncome.category,
            subcategory: monthlyIncome.subCategory,
            key: monthlyIncome.key,
            notes: monthlyIncome.notes,
            type: TransactionTypes.MonthlyIncome,
          });
        }
      });
      return monthlyIncomeTransactions;
    });
  }

  @Action(IncomeActions.Get)
  getAllIncomes(context: StateContext<IncomeStateModel>) {
    this.incomeService.getAll().subscribe((inputIncomes: Income[]) => {
      let incomes: Income[] = [];
      inputIncomes.forEach((t) => {
        incomes.push({
          amount: t.amount,
          date: new Date(t.date),
          toAccount: t.toAccount,
          category: t.category,
          subCategory: t.subCategory,
          isApplied: t.isApplied,
          monthlyKey: t.monthlyKey,
          key: t.key,
          notes: t.notes,
        });
      });
      context.dispatch(new IncomeActions.GetSuccess(incomes));

      let transactions: Transaction[] = [];
      incomes.forEach((i: Income) => {
        transactions.push(this.getTransactionFromIncome(i));
      });
      context.dispatch(new IncomeActions.GetTransactionsSuccess(transactions));
    });
  }

  private getTransactionFromIncome(income: Income): Transaction {
    return {
      category: income.category,
      applied: income.isApplied,
      amount: income.amount,
      date: new Date(income.date),
      account: income.toAccount,
      subcategory: income.subCategory,
      monthlyKey: income.monthlyKey,
      key: income.key,
      notes: income.notes,
      type: TransactionTypes.Income,
    };
  }

  private getIncomeFromTransaction(transaction: Transaction): Income {
    return this.getIncomeFromTransactionAndDate(transaction, transaction.date);
  }

  private getIncomeFromTransactionAndDate(
    transaction: Transaction,
    date: Date
  ): Income {
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
      toAccount: transaction.account,
      key: transaction.monthlyKey ? null : transaction.key,
      monthlyKey: transaction.monthlyKey ? transaction.monthlyKey : null,
    };
  }

  /* Monthly Income Categories */
  @Action(MonthlyIncomeActions.Get)
  getAllMonthlyIncome(context: StateContext<IncomeStateModel>) {
    this.monthlyIncomeService
      .getAll()
      .subscribe((monthlyIncomes: MonthlyIncome[]) =>
        context.dispatch(new MonthlyIncomeActions.GetSuccess(monthlyIncomes))
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

  @Action(MonthlyIncomeActions.GetSuccess)
  monthlyIncomesLoaded(
    ctx: StateContext<IncomeStateModel>,
    action: MonthlyIncomeActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      monthlyIncomes: action.payload,
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

  @Action(IncomeActions.DeleteIncome)
  deleteIncome(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.DeleteIncome
  ) {
    this.incomeService.delete(action.payload.key);

    ctx.setState(
      patch({
        transactions: removeItem<Transaction>(
          (t) => t.key == action.payload.key
        ),
        incomes: removeItem<Income>((t) => t.key == action.payload.key),
      })
    );

    if (action.payload.applied) {
      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: action.payload.account.key,
          adjustment: action.payload.amount * -1,
        })
      );
    }
  }

  @Action(MonthlyIncomeActions.DeleteMonthlyIncome)
  deleteMonthlyIncome(
    ctx: StateContext<IncomeStateModel>,
    action: MonthlyIncomeActions.DeleteMonthlyIncome
  ) {
    this.monthlyIncomeService.delete(action.payload.key);
  }

  @Action(IncomeActions.ApplyIncomeTransaction)
  applyIncome(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.ApplyIncomeTransaction
  ) {
    ctx.setState(
      patch({
        transactions: removeItem<Transaction>(
          (t) => t.key == action.payload.key
        )
      })
    );
    ctx.dispatch(new IncomeActions.SaveIncomeTransaction(action.payload));

    ctx.dispatch(
      new AccountActions.AdjustAccountBalance({
        accountKey: action.payload.account.key,
        adjustment: action.payload.amount,
      })
    );
  }

  @Action(IncomeActions.SaveIncomeTransaction)
  saveIncomeTransaction(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.SaveIncomeTransaction
  ) {
    let income: Income = this.getIncomeFromTransaction(action.payload);

    if (action.payload.key && action.payload.type == TransactionTypes.Income) {
      const stateIncome: Income = ctx
        .getState()
        .incomes.find((i) => i.key == action.payload.key);

      if (stateIncome.isApplied) {
        // Adjustment in same account
        if (stateIncome.toAccount.key == income.toAccount.key) {
          let adjustment: number = income.amount - stateIncome.amount;

          this.store.dispatch(
            new AccountActions.AdjustAccountBalance({
              adjustment: adjustment,
              accountKey: income.toAccount.key,
            })
          );
        } else {
          // Adjustment to different account
          this.store.dispatch(
            new AccountActions.AdjustAccountBalance({
              adjustment: stateIncome.amount * -1,
              accountKey: stateIncome.toAccount.key,
            })
          );
          this.store.dispatch(
            new AccountActions.AdjustAccountBalance({
              adjustment: income.amount,
              accountKey: income.toAccount.key,
            })
          );
        }
      }

      this.incomeService.update(income);

      ctx.setState(
        patch({
          transactions: updateItem<Transaction>(t => t.key == action.payload.key, action.payload),
        })
      );
    } else {
      this.incomeService.create(income).then((r) => {
        ctx.dispatch(new IncomeActions.GetSuccess(ctx.getState().incomes));
      });

      if (income.isApplied) {
        this.store.dispatch(
          new AccountActions.AdjustAccountBalance({
            adjustment: income.amount,
            accountKey: income.toAccount.key,
          })
        );
      }
    }
  }

  @Action(MonthlyIncomeActions.SaveMonthlyIncomeTransaction)
  saveMonthlyIncomeTransaction(
    ctx: StateContext<IncomeStateModel>,
    action: MonthlyIncomeActions.SaveMonthlyIncomeTransaction
  ) {
    let monthlyIncome: MonthlyIncome = {
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
      toAccount: action.payload.account,
      key: action.payload.key,
    };

    if (monthlyIncome.key) {
      this.monthlyIncomeService.update(monthlyIncome);
    } else {
      this.monthlyIncomeService.create(monthlyIncome);
    }
  }

  @Action(RecurringIncomeActions.SaveRecurringIncomeTransaction)
  saveRecurringIncomeTransaction(
    ctx: StateContext<IncomeStateModel>,
    action: RecurringIncomeActions.SaveRecurringIncomeTransaction
  ) {
    let transaction: Transaction = action.payload;
    let transactions: Transaction[] = [];

    for (let index = 0; index < transaction.recurringTimes; index++) {
      if (transaction.applied && index == 0) {
        transactions.push(transaction);
      } else {
        let newTransaction: Transaction = { ...transaction };
        newTransaction.applied = false;
        newTransaction.date = this.getDateByRecurringType(transaction, index);
        transactions.push(newTransaction);
      }
    }

    transactions.forEach((t: Transaction) => {
      this.store.dispatch(new IncomeActions.SaveIncomeTransaction(t));
    });
  }

  private getDateByRecurringType(transaction: Transaction, index: number): Date{
    switch (transaction.recurringType) {
      case RecurringTypes.Days:
        return new Date(transaction.date.getFullYear(), transaction.date.getMonth(), transaction.date.getDate() + index);
      case RecurringTypes.Weeks:
        return new Date(transaction.date.getFullYear(), transaction.date.getMonth(), transaction.date.getDate() + (index * 7));
      case RecurringTypes.Months:
        return new Date(transaction.date.getFullYear(), transaction.date.getMonth() + index, transaction.date.getDate());
      case RecurringTypes.Years:
        return new Date(transaction.date.getFullYear() + index, transaction.date.getMonth(), transaction.date.getDate());
      default:
        return new Date();
    }
  }
}
