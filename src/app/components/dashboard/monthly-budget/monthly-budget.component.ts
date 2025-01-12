import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Account } from 'src/app/account';
import { Expense } from 'src/app/expense';
import { MonthlyBudget, Transaction, TransactionTypes } from 'src/app/models';
import { PlannedExpense } from 'src/app/planned-expense';
import { AccountState, ExpenseState, IncomeState } from 'src/app/state';
import {
  getCategoryTextForPlannedExpense,
  isExpenseInPlannedExpense,
} from 'src/app/utils';

@Component({
  selector: 'monthly-budget',
  templateUrl: './monthly-budget.component.html',
  styleUrls: ['./monthly-budget.component.scss'],
})
export class MonthlyBudgetComponent implements OnInit {
  monthlyIncomes$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  monthlyExpenses$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
  plannedExpenses$: Observable<PlannedExpense[]>;
  @Select(AccountState.selectSumsToBudgetAccounts) accounts$: Observable<
    Account[]
  >;

  public totalforMonth: number;

  // Doughnut
  public doughnutChartLabels: Label[] = [
    'Gasto proyectado',
    'Gastos',
    'Entradas',
  ];
  public doughnutChartData = [];
  public doughnutChartType: ChartType = 'doughnut';
  public options: ChartOptions = {
    circumference: Math.PI,
    rotation: Math.PI,
    legend: {
      display: false,
    },
  };
  public barChartColors: Color[] = [
    {
      backgroundColor: [
        'rgba(138, 22, 255, 0.7)',
        'rgba(255, 37, 194, 0.7)',
        'rgba(36, 223, 254, 0.7)',
      ],
    },
  ];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.setData(new Date());
  }

  public setData(date: Date): void {
    // Monthly Budget
    this.monthlyIncomes$ = this.store.select(
      IncomeState.selectMonthlyIncomeTransactionsForMonth(date)
    );
    this.incomes$ = this.store.select(
      IncomeState.selectTransactionsForMonth(date)
    );
    this.monthlyExpenses$ = this.store.select(
      ExpenseState.selectMonthlyExpenseTransactionsForMonth(date)
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectTransactionsForMonth(date)
    );
    this.plannedExpenses$ = this.store.select(
      ExpenseState.selectPlannedExpensesForMonth(date)
    );
    this.incomes$.subscribe((incomes) => {
      this.expenses$.subscribe((expenses) => {
        this.monthlyExpenses$.subscribe((monthlyExpenses) => {
          this.monthlyIncomes$.subscribe((monthlyIncomes) => {
            this.accounts$.subscribe((accounts) => {
              this.plannedExpenses$
                .pipe(delay(0))
                .subscribe((plannedExpenses: PlannedExpense[]) => {
                  this.setMonthlyData(
                    incomes,
                    monthlyIncomes,
                    expenses,
                    monthlyExpenses,
                    plannedExpenses,
                    accounts,
                    date
                  );
                });
            });
          });
        });
      });
    });
  }

  private setMonthlyData(
    incomes: Transaction[],
    monthlyIncomes: Transaction[],
    expenses: Transaction[],
    monthlyExpenses: Transaction[],
    plannedExpenses: PlannedExpense[],
    accounts: Account[],
    date: Date
  ): void {
    // Incomes
    const incomesAmount: number = incomes.reduce((a, b) => +a + +b.amount, 0);
    const unpaidIncomesAmount: number = incomes
      .filter((e) => !e.applied)
      .reduce((a, b) => +a + +b.amount, 0);
    const unpaidMonthlyIncomesAmount: number = monthlyIncomes.reduce(
      (a, b) => +a + +b.amount,
      0
    );
    // Expenses
    const unpaidMonthlyExpensesAmount: number = monthlyExpenses.reduce(
      (a, b) => +a + +b.amount,
      0
    );
    const paidExpensesAmount: number = expenses.reduce(
      (a, b) => +a + +b.amount,
      0
    );
    // Balance
    const accountsBalanceAmount: number = accounts.reduce(
      (a, b) => +a + +b.currentBalance,
      0
    );

    // Planned expenses
    const expensesForTheMonth = expenses.filter(
      (t) => t.type == TransactionTypes.Expense
    );
    const expensesByCategory: Map<string, Expense[]> = new Map();
    plannedExpenses.forEach((plannedExpense) => {
      let category = getCategoryTextForPlannedExpense(plannedExpense);
      let filteredExpenses = expensesForTheMonth.filter((e) =>
        isExpenseInPlannedExpense(plannedExpense, e)
      ) as unknown as Expense[];
      expensesByCategory.set(category, filteredExpenses);
    });
    const plannedExpensesAmount: number = plannedExpenses.reduce(
      (acc, cur) => acc + cur.totalAmount - this.getSpentAmount(cur, expensesByCategory),
      0
    );

    const monthlyBudgetData: MonthlyBudget = {
      plannedExpensesAmount: plannedExpensesAmount + unpaidMonthlyExpensesAmount,
      expensesAmount: paidExpensesAmount,
      incomesAmount: incomesAmount + unpaidMonthlyIncomesAmount,
      currentBalance: accountsBalanceAmount,
      unpaidIncomesAmount,
      unpaidMonthlyIncomesAmount
    };

    this.initMonthlyDataGraph(monthlyBudgetData, date);
  }

  getSpentAmount(
    plannedExpense: PlannedExpense,
    expensesByCategory: Map<string, Expense[]>
  ): number {
    const category = getCategoryTextForPlannedExpense(plannedExpense);

    if (expensesByCategory == undefined || !expensesByCategory.has(category))
      return 0;

    const amount = expensesByCategory
      .get(category)
      .reduce((acc, cur) => acc + cur.amount, 0);
    return Math.min(amount, plannedExpense.totalAmount);
  }

  private initMonthlyDataGraph(
    monthlyBudgetData: MonthlyBudget,
    date: Date
  ): void {
    this.doughnutChartData = [];
    this.doughnutChartData.push(monthlyBudgetData.plannedExpensesAmount);
    this.doughnutChartData.push(monthlyBudgetData.expensesAmount);
    this.doughnutChartData.push(monthlyBudgetData.incomesAmount);
    this.totalforMonth = this.calculateTotalForMonth(monthlyBudgetData, date);
  }

  private calculateTotalForMonth(
    monthlyBudgetData: MonthlyBudget,
    date: Date
  ): number {
    const today = new Date();
    const todayYearMonth: number = +`${today.getFullYear()}${today.getMonth()}`;
    const dateYearMonth: number = +`${date.getFullYear()}${date.getMonth()}`;

    const isPastMonth = () => todayYearMonth > dateYearMonth;

    return isPastMonth()
      ? monthlyBudgetData.incomesAmount - monthlyBudgetData.expensesAmount
      : monthlyBudgetData.currentBalance +
          monthlyBudgetData.unpaidMonthlyIncomesAmount +
          monthlyBudgetData.unpaidIncomesAmount -
          monthlyBudgetData.plannedExpensesAmount;
  }
}
