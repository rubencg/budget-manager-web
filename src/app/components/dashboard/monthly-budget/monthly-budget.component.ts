import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import { Account } from 'src/app/account';
import { MonthlyBudget, Transaction } from 'src/app/models';
import { AccountState, ExpenseState, IncomeState } from 'src/app/state';

@Component({
  selector: 'monthly-budget',
  templateUrl: './monthly-budget.component.html',
  styleUrls: ['./monthly-budget.component.scss'],
})
export class MonthlyBudgetComponent implements OnInit {
  date: Date = new Date();
  monthlyIncomes$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  monthlyExpenses$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
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
    // Monthly Budget
    this.monthlyIncomes$ = this.store.select(
      IncomeState.selectMonthlyIncomeTransactionsForMonth(this.date)
    );
    this.incomes$ = this.store.select(
      IncomeState.selectTransactionsForMonth(this.date)
    );
    this.monthlyExpenses$ = this.store.select(
      ExpenseState.selectMonthlyExpenseTransactionsForMonth(this.date)
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectTransactionsForMonth(this.date)
    );
    this.incomes$.subscribe((incomes) => {
      this.expenses$.subscribe((expenses) => {
        this.monthlyExpenses$.subscribe((monthlyExpenses) => {
          this.monthlyIncomes$.subscribe((monthlyIncomes) => {
            this.accounts$.subscribe((accounts) => {
              this.setMonthlyData(
                incomes,
                monthlyIncomes,
                expenses,
                monthlyExpenses,
                accounts
              );
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
    accounts: Account[]
  ) {
    const incomesAmount: number = incomes.reduce((a, b) => +a + +b.amount, 0);
    const monthlyIncomesAmount: number = monthlyIncomes.reduce((a, b) => +a + +b.amount, 0);
    const paidExpensesAmount: number = expenses
      .filter((e) => e.applied)
      .reduce((a, b) => +a + +b.amount, 0);
    const unPaidExpensesAmount: number = expenses
      .filter((e) => !e.applied)
      .reduce((a, b) => +a + +b.amount, 0);
    const monthlyExpensesAmount: number = monthlyExpenses.reduce((a, b) => +a + +b.amount, 0);
    const accountsBalanceAmount: number = accounts.reduce((a, b) => +a + +b.currentBalance, 0);

    const monthlyBudgetData: MonthlyBudget = {
      budgetExpensesAmount: unPaidExpensesAmount + monthlyExpensesAmount,
      expensesAmount: paidExpensesAmount,
      incomesAmount: incomesAmount + monthlyIncomesAmount,
      currentBalance: accountsBalanceAmount,
    };

    this.initMonthlyDataGraph(monthlyBudgetData);
  }

  private initMonthlyDataGraph(monthlyBudgetData: MonthlyBudget) {
    this.doughnutChartData = [];
    this.doughnutChartData.push(monthlyBudgetData.budgetExpensesAmount);
    this.doughnutChartData.push(monthlyBudgetData.expensesAmount);
    this.doughnutChartData.push(monthlyBudgetData.incomesAmount);
    this.totalforMonth = this.calculateTotalForMonth(monthlyBudgetData);
  }

  calculateTotalForMonth(monthlyBudgetData: MonthlyBudget): number {
    return (
      monthlyBudgetData.currentBalance - monthlyBudgetData.budgetExpensesAmount
    );
  }
}
