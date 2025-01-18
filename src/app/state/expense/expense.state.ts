import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
  State,
  Action,
  StateContext,
  createSelector,
  Store,
} from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';
import {
  Expense,
  ExpenseService,
  MonthlyExpense,
  MonthlyExpenseService,
} from 'src/app/expense';
import {
  RecurringTypes,
  TopExpense,
  Transaction,
  TransactionTypes,
} from 'src/app/models';
import { AccountActions } from '../account';
import { ExpenseActions } from './expense.actions';
import { MonthlyExpenseActions } from './monthly.expense.actions';
import { RecurringExpenseActions } from './recurring.expense.actions';
import { PlannedExpense } from 'src/app/planned-expense';
import { PlannedExpenseActions } from './planned-expense.actions';
import { SavingActions } from './saving-actions';
import { PlannedExpenseService } from 'src/app/planned-expense/planned-expense.service';
import { Saving, SavingService } from 'src/app/saving';

export interface ExpenseStateModel {
  expenses: Expense[];
  monthlyExpenses: MonthlyExpense[];
  transactions: Transaction[];
  plannedExpenses: PlannedExpense[];
  savings: Saving[];
}

@State<ExpenseStateModel>({
  name: 'expenseState',
  defaults: {
    expenses: [],
    monthlyExpenses: [],
    transactions: [],
    plannedExpenses: [],
    savings: [],
  },
})
@Injectable()
export class ExpenseState {
  constructor(
    private expenseService: ExpenseService,
    private store: Store,
    private monthlyExpenseService: MonthlyExpenseService,
    private plannedExpenseService: PlannedExpenseService,
    private savingService: SavingService
  ) {}

  static selectPlannedExpensesForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) =>
      state.plannedExpenses.filter(
        (p: PlannedExpense) =>
          p.isRecurring ||
          (p.date.getMonth() == date.getMonth() &&
            p.date.getFullYear() == date.getFullYear())
      )
    );
  }

  static selectTransactionsForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  static selectTransactionsForDates(startDate: Date, endDate: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getFullYear() >= startDate.getFullYear() &&
          t.date.getMonth() >= startDate.getMonth() &&
          t.date.getDate() >= startDate.getDate() &&
          t.date.getFullYear() <= endDate.getFullYear() &&
          t.date.getMonth() <= endDate.getMonth() &&
          t.date.getDate() <= endDate.getDate()
      )
    );
  }

  static selectUnpaidTransactionsForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear() &&
          !t.applied
      )
    );
  }

  static selectPaidTransactionsForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear() &&
          t.applied
      )
    );
  }

  static selectMonthlyExpenseTransactionsForMonth(
    date: Date,
    includeApplied: boolean = false
  ) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) => {
      let monthlyExpenseTransactions: Transaction[] = [];
      let expenses = state.expenses.filter(
        (t: Expense) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      );

      state.monthlyExpenses.forEach((monthlyExpense: MonthlyExpense) => {
        const filteredExpense = expenses.find(
          (i) => i.monthlyKey == monthlyExpense.key
        );

        if (includeApplied || !filteredExpense) {
          monthlyExpenseTransactions.push({
            amount: monthlyExpense.amount,
            appliedAmount: filteredExpense?.amount,
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

  static getExpensesGrouppedByCategoryForMonth(date: Date) {
    return createSelector([ExpenseState], (state: ExpenseStateModel) => {
      // group expenses by category
      const appliedExpenses: Expense[] = state.expenses.filter(
        (t: Expense) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear() &&
          t.isApplied
      );
      const expensesByCategory = _.groupBy(
        appliedExpenses,
        (e: Expense) => e.category.name
      );

      const topExpenses: TopExpense[] = _.map(
        expensesByCategory,
        function (value, key) {
          const topExpense: TopExpense = {
            name: key,
            amount: value.reduce((a, b: Expense) => +a + b.amount, 0),
          };
          return topExpense;
        }
      );

      return topExpenses;
    });
  }

  static selectAllSavings() {
    return createSelector([ExpenseState], (state: ExpenseStateModel) => {
      return state.savings;
    });
  }

  @Action(ExpenseActions.Get)
  getAllExpenses(context: StateContext<ExpenseStateModel>) {
    this.expenseService
      .getAll(
        this.store.selectSnapshot((state) => state.authenticationState.user).uid
      )
      .subscribe((inputExpenses: Expense[]) => {
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
            monthlyKey: t.monthlyKey,
            removeFromSpendingPlan: t.removeFromSpendingPlan,
          });
        });
        context.dispatch(new ExpenseActions.GetSuccess(expenses));

        let transactions: Transaction[] = [];
        expenses.forEach((e) => {
          transactions.push(this.getTransactionFromExpense(e));
        });
        context.dispatch(
          new ExpenseActions.GetTransactionsSuccess(transactions)
        );
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
      removeFromSpendingPlan: expense?.removeFromSpendingPlan ?? false,
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
      removeFromSpendingPlan: transaction.removeFromSpendingPlan,
    };
  }

  // Planned Expense actions
  @Action(PlannedExpenseActions.Get)
  getAllPlannedExpense(context: StateContext<ExpenseStateModel>) {
    this.plannedExpenseService
      .getAll(
        this.store.selectSnapshot((state) => state.authenticationState.user).uid
      )
      .subscribe((inputPlannedExpenses: PlannedExpense[]) => {
        let plannedExpenses: PlannedExpense[] = [];
        inputPlannedExpenses.forEach((p) => {
          plannedExpenses.push({
            name: p.name,
            category: p.category,
            subCategory: p.subCategory,
            date: new Date(p.date),
            isRecurring: p.isRecurring,
            totalAmount: p.totalAmount,
            key: p.key,
          });
        });
        context.dispatch(new PlannedExpenseActions.GetSuccess(plannedExpenses));
      });
  }

  @Action(PlannedExpenseActions.GetSuccess)
  plannedExpensesLoaded(
    ctx: StateContext<ExpenseStateModel>,
    action: PlannedExpenseActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      plannedExpenses: action.payload,
    });
  }

  @Action(PlannedExpenseActions.DeletePlannedExpense)
  deletePlannedExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: PlannedExpenseActions.DeletePlannedExpense
  ) {
    this.plannedExpenseService.delete(
      this.store.selectSnapshot((state) => state.authenticationState.user).uid,
      action.payload.key
    );

    ctx.setState(
      patch({
        plannedExpenses: removeItem<PlannedExpense>((t) => t.key == action.payload.key),
      })
    );
  }

  @Action(PlannedExpenseActions.SavePlannedExpense)
  savePlannedExpenseTransaction(
    ctx: StateContext<ExpenseStateModel>,
    action: PlannedExpenseActions.SavePlannedExpense
  ) {
    const uid: string = this.store.selectSnapshot(
      (state) => state.authenticationState.user
    ).uid;

    let plannedExpense: PlannedExpense = {
      name: action.payload.name,
      date: action.payload.date,
      isRecurring: action.payload.isRecurring,
      totalAmount: action.payload.totalAmount,
      category: {
        image: action.payload.category.image,
        name: action.payload.category.name,
        color: action.payload.category.color,
        subcategories: action.payload.category.subcategories
          ? action.payload.category.subcategories
          : [],
      },
      subCategory: action.payload.subCategory
        ? action.payload.subCategory
        : null,
      key: action.payload.key,
    };

    if (plannedExpense.key) {
      this.plannedExpenseService.update(uid, plannedExpense).then(() => {
        ctx.setState(
          patch({
            plannedExpenses: updateItem<PlannedExpense>(t => t.key == plannedExpense.key, plannedExpense),
          })
        );
      })
    } else {
      this.plannedExpenseService.create(uid, plannedExpense).then(() => {
        ctx.dispatch(new PlannedExpenseActions.GetSuccess(ctx.getState().plannedExpenses));
      });
    }
  }

  // Saving actions
  @Action(SavingActions.Get)
  getAllSavings(context: StateContext<ExpenseStateModel>) {
    this.savingService
      .getAll(
        this.store.selectSnapshot((state) => state.authenticationState.user).uid
      )
      .subscribe((inputSavings: Saving[]) => {
        let savings: Saving[] = [];
        inputSavings.forEach((p) => {
          savings.push({
            name: p.name,
            goalAmount: p.goalAmount,
            amountPerMonth: p.amountPerMonth,
            icon: p.icon,
            savedAmount: p.savedAmount,
            color: p.color,
            key: p.key,
          });
        });
        context.dispatch(new SavingActions.GetSuccess(savings));
      });
  }

  @Action(SavingActions.GetSuccess)
  savingsLoaded(
    ctx: StateContext<ExpenseStateModel>,
    action: SavingActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      savings: action.payload,
    });
  }

  @Action(SavingActions.DeleteSaving)
  deleteSaving(
    ctx: StateContext<ExpenseStateModel>,
    action: SavingActions.DeleteSaving
  ) {
    this.savingService.delete(
      this.store.selectSnapshot((state) => state.authenticationState.user).uid,
      action.payload.key
    );

    ctx.setState(
      patch({
        savings: removeItem<Saving>((t) => t.key == action.payload.key),
      })
    );
  }

  @Action(SavingActions.SaveSaving)
  saveSaving(
    ctx: StateContext<ExpenseStateModel>,
    action: SavingActions.SaveSaving
  ) {
    const uid: string = this.store.selectSnapshot(
      (state) => state.authenticationState.user
    ).uid;

    let saving: Saving = {
      name: action.payload.name,
      goalAmount: action.payload.goalAmount,
      amountPerMonth: action.payload.amountPerMonth,
      icon: action.payload.icon,
      savedAmount: action.payload.savedAmount,
      color: action.payload.color,
      key: action.payload.key,
    };

    if (saving.key) {
      this.savingService.update(uid, saving);
      ctx.setState(
        patch({
          savings: updateItem<Saving>(t => t.key == saving.key, saving),
        })
      );
    } else {
      this.savingService.create(uid, saving).then(() => {
        ctx.dispatch(new SavingActions.GetSuccess(ctx.getState().savings));
      });
    }
  }

  @Action(SavingActions.UpdateSavingAmount)
  updateSaving(
    ctx: StateContext<ExpenseStateModel>,
    action: SavingActions.UpdateSavingAmount
  ) {
    const stateSaving: Saving = ctx.getState().savings.find((i) => i.key == action.payload.key);
    let saving: Saving = { ...stateSaving };
    if (saving.savedAmount) {
      saving.savedAmount += action.payload.increment;
    } else {
      saving.savedAmount = action.payload.increment;
    }

    ctx.setState(
      patch({
        savings: updateItem<Saving>((t) => t.key == saving.key, saving),
      })
    );

    this.savingService.update(this.store.selectSnapshot((state) => state.authenticationState.user).uid, saving);
  }

  /* Monthly Expense Categories */
  @Action(MonthlyExpenseActions.Get)
  getAllMonthlyExpense(context: StateContext<ExpenseStateModel>) {
    this.monthlyExpenseService
      .getAll(
        this.store.selectSnapshot((state) => state.authenticationState.user).uid
      )
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
    this.monthlyExpenseService.delete(
      this.store.selectSnapshot((state) => state.authenticationState.user).uid,
      action.payload.key
    );
  }

  @Action(ExpenseActions.ApplyExpenseTransaction)
  applyExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.ApplyExpenseTransaction
  ) {
    ctx.setState(
      patch({
        transactions: removeItem<Transaction>(
          (t) => t.key == action.payload.key
        ),
      })
    );

    ctx.dispatch(new ExpenseActions.SaveExpenseTransaction(action.payload));

    ctx.dispatch(
      new AccountActions.AdjustAccountBalance({
        accountKey: action.payload.account.key,
        adjustment: action.payload.amount * -1,
      })
    );
  }

  @Action(ExpenseActions.DeleteExpense)
  deleteExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.DeleteExpense
  ) {
    this.expenseService.delete(
      this.store.selectSnapshot((state) => state.authenticationState.user).uid,
      action.payload.key
    );

    ctx.setState(
      patch({
        transactions: removeItem<Transaction>(
          (t) => t.key == action.payload.key
        ),
        expenses: removeItem<Expense>((t) => t.key == action.payload.key),
      })
    );

    if (action.payload.applied) {
      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: action.payload.account.key,
          adjustment: action.payload.amount,
        })
      );
    }
  }

  @Action(ExpenseActions.SaveExpenseTransaction)
  saveExpenseTransaction(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.SaveExpenseTransaction
  ) {
    let expense: Expense = this.getExpenseFromTransaction(action.payload);
    const uid: string = this.store.selectSnapshot(
      (state) => state.authenticationState.user
    ).uid;

    if (action.payload.key && action.payload.type == TransactionTypes.Expense) {
      const stateExpense: Expense = ctx
        .getState()
        .expenses.find((i) => i.key == action.payload.key);

      if (stateExpense.isApplied) {
        // Adjustment in same account
        if (stateExpense.fromAccount.key == expense.fromAccount.key) {
          let adjustment: number = stateExpense.amount - expense.amount;

          this.store.dispatch(
            new AccountActions.AdjustAccountBalance({
              adjustment: adjustment,
              accountKey: expense.fromAccount.key,
            })
          );
        } else {
          // Adjustment to different account
          this.store.dispatch(
            new AccountActions.AdjustAccountBalance({
              adjustment: stateExpense.amount,
              accountKey: stateExpense.fromAccount.key,
            })
          );
          this.store.dispatch(
            new AccountActions.AdjustAccountBalance({
              adjustment: expense.amount * -1,
              accountKey: expense.fromAccount.key,
            })
          );
        }
      }

      ctx.setState(
        patch({
          transactions: updateItem<Transaction>(
            (t) => t.key == action.payload.key,
            action.payload
          ),
        })
      );

      this.expenseService.update(uid, expense);
    } else {
      this.expenseService.create(uid, expense).then((r) => {
        ctx.dispatch(new ExpenseActions.GetSuccess(ctx.getState().expenses));
      });

      if (
        expense.isApplied &&
        action.payload.type == TransactionTypes.Expense
      ) {
        this.store.dispatch(
          new AccountActions.AdjustAccountBalance({
            adjustment: expense.amount * -1,
            accountKey: expense.fromAccount.key,
          })
        );
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

    this.saveMonthlyExpenseToDb(ctx, monthlyExpense);
  }

  @Action(MonthlyExpenseActions.SaveMonthlyExpense)
  saveMonthlyExpense(
    ctx: StateContext<ExpenseStateModel>,
    action: MonthlyExpenseActions.SaveMonthlyExpense
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
      day: action.payload.day,
      notes: action.payload.notes,
      subCategory: action.payload.subCategory
        ? action.payload.subCategory
        : null,
      fromAccount: action.payload.fromAccount,
      key: action.payload.key,
    };
    
    this.saveMonthlyExpenseToDb(ctx, monthlyExpense);
  }

  saveMonthlyExpenseToDb(ctx: StateContext<ExpenseStateModel>,
    monthlyExpense: MonthlyExpense){
    const uid: string = this.store.selectSnapshot(
      (state) => state.authenticationState.user
    ).uid;

    if (monthlyExpense.key) {
      this.monthlyExpenseService.update(uid, monthlyExpense);
      ctx.setState(
        patch({
          monthlyExpenses: updateItem<MonthlyExpense>(t => t.key == monthlyExpense.key, monthlyExpense),
        })
      );
    } else {
      this.monthlyExpenseService.create(uid, monthlyExpense).then(() => {
        ctx.dispatch(new MonthlyExpenseActions.GetSuccess(ctx.getState().monthlyExpenses));
      });
    }
  }

  @Action(RecurringExpenseActions.SaveRecurringExpenseTransaction)
  saveRecurringExpenseTransaction(
    ctx: StateContext<ExpenseStateModel>,
    action: RecurringExpenseActions.SaveRecurringExpenseTransaction
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
      this.store.dispatch(new ExpenseActions.SaveExpenseTransaction(t));
    });
  }

  private getDateByRecurringType(
    transaction: Transaction,
    index: number
  ): Date {
    switch (transaction.recurringType) {
      case RecurringTypes.Days:
        return new Date(
          transaction.date.getFullYear(),
          transaction.date.getMonth(),
          transaction.date.getDate() + index
        );
      case RecurringTypes.Weeks:
        return new Date(
          transaction.date.getFullYear(),
          transaction.date.getMonth(),
          transaction.date.getDate() + index * 7
        );
      case RecurringTypes.Months:
        return new Date(
          transaction.date.getFullYear(),
          transaction.date.getMonth() + index,
          transaction.date.getDate()
        );
      case RecurringTypes.Years:
        return new Date(
          transaction.date.getFullYear() + index,
          transaction.date.getMonth(),
          transaction.date.getDate()
        );
      default:
        return new Date();
    }
  }
}
