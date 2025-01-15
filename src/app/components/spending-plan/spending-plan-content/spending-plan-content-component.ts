import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction, TransactionTypes } from 'src/app/models';
import { PlannedExpense } from 'src/app/planned-expense';
import { IncomeState, ExpenseState } from 'src/app/state';
import { HeaderFeatures } from '../../transactions/header/header.component';
import { Expense } from 'src/app/expense';
import {
  getCategoryTextForPlannedExpense,
  isExpenseInPlannedExpense,
} from 'src/app/utils';
import { Saving } from 'src/app/saving';

@Component({
  selector: 'app-spending-plan-content',
  templateUrl: './spending-plan-content-component.html',
  styleUrls: ['./spending-plan-content-component.scss'],
})
export class SpendingPlanContentComponent implements OnInit {
  selectedSection: string = 'income'; // Variable para controlar el contenido

  // Income
  monthlyIncomes$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  allIncomes: Transaction[];
  incomesSum: number = 0;
  // Expenses
  monthlyExpenses$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
  allExpenses: Transaction[];
  expensesSum: number = 0;
  // Other expenses
  otherExpenses: Expense[] = [];
  otherExpensesSum: number = 0;
  availableAmount: number = 0;
  // Planned expenes
  plannedExpenses$: Observable<PlannedExpense[]>;
  plannedExpenses: PlannedExpense[];
  plannedExpensesSum: number;
  expensesForTheMonth: Transaction[];
  expensesByCategory: Map<string, Expense[]> = new Map();
  expensesSumByCategory: Map<string, number> = new Map();
  currentDate: Date = new Date();
  headerDisplayFeatures: Record<HeaderFeatures, boolean> = {
    [HeaderFeatures.SearchButton]: false,
    [HeaderFeatures.AddIncome]: false,
    [HeaderFeatures.AddExpense]: false,
    [HeaderFeatures.AddTransfer]: false,
    [HeaderFeatures.AddPlannedExpense]: true,
    [HeaderFeatures.AddSaving]: true,
    [HeaderFeatures.FilterButton]: false,
  };
  // Savings
  savings$: Observable<Saving[]>;
  savings: Saving[];
  savingSum: number;

  constructor(public store: Store) {}

  ngOnInit(): void {
    this.loadData(this.currentDate);
  }

  loadData(date: Date) {
    // Get incomes for the current month
    this.monthlyIncomes$ = this.store.select(
      IncomeState.selectMonthlyIncomeTransactionsForMonth(date)
    );
    this.incomes$ = this.store.select(
      IncomeState.selectTransactionsForMonth(date)
    );
    this.incomes$.subscribe((incomes: Transaction[]) => {
      this.monthlyIncomes$
        .pipe(delay(0))
        .subscribe((monthlyIncomes: Transaction[]) => {
          this.allIncomes = monthlyIncomes.concat(incomes);
          this.incomesSum = this.allIncomes.reduce(
            (acc, cur) => acc + cur.amount,
            0
          );
        });
    });

    // Get expenses for the current month
    this.monthlyExpenses$ = this.store.select(
      ExpenseState.selectMonthlyExpenseTransactionsForMonth(date, true)
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectTransactionsForMonth(date)
    );
    this.plannedExpenses$ = this.store.select(
      ExpenseState.selectPlannedExpensesForMonth(date)
    );
    this.savings$ = this.store.select(ExpenseState.selectAllSavings());

    this.savings$.subscribe((savings: Saving[]) => {
      this.savings = savings;
      this.savingSum = savings.reduce(
        (acc, cur) => acc + cur.amountPerMonth, 0
      );
    });

    this.expenses$.subscribe((expenses: Transaction[]) => {
      this.monthlyExpenses$
        .pipe(delay(0))
        .subscribe((monthlyExpenses: Transaction[]) => {
          // Used in sp-spending-plan-content
          this.expensesForTheMonth = expenses.filter(
            (t) => t.type == TransactionTypes.Expense
          );
          this.plannedExpenses$
            .pipe(delay(0))
            .subscribe((plannedExpenses: PlannedExpense[]) => {
              if (plannedExpenses == undefined) return;

              let expensesByCategoryTemp: Map<string, Expense[]> = new Map();
              plannedExpenses.forEach((plannedExpense) => {
                let category = getCategoryTextForPlannedExpense(plannedExpense);
                let filteredExpenses = this.expensesForTheMonth.filter((e) =>
                  isExpenseInPlannedExpense(plannedExpense, e)
                ) as unknown as Expense[];
                expensesByCategoryTemp.set(category, filteredExpenses);
                this.expensesSumByCategory.set(
                  category,
                  filteredExpenses.reduce((acc, cur) => acc + cur.amount, 0)
                );
              });
              this.expensesByCategory = expensesByCategoryTemp;
              this.plannedExpenses = plannedExpenses;
              this.plannedExpensesSum = plannedExpenses.reduce(
                (acc, cur) =>
                  acc +
                  Math.max(
                    cur.totalAmount,
                    this.expensesSumByCategory.get(
                      getCategoryTextForPlannedExpense(cur)
                    )
                  ),
                0
              );

              // Other expenses
              let allPlannedExpenses = Array.from(
                this.expensesByCategory.values()
              ).reduce((acc, expenses) => acc.concat(expenses), []);
              this.otherExpenses = this.expensesForTheMonth.filter(
                (expense) =>
                  !allPlannedExpenses.some((e) => e.key === expense.key) &&
                  !expense.removeFromSpendingPlan &&
                  !expense.monthlyKey
              ) as unknown as Expense[];
              this.otherExpensesSum = this.otherExpenses.reduce(
                (acc, cur) => acc + cur.amount,
                0
              );

              // Calculate available amount
              this.availableAmount =
                this.incomesSum +
                this.expensesSum -
                (this.plannedExpensesSum + this.otherExpensesSum);
            });

          // Used in sp-summary-component
          this.allExpenses = monthlyExpenses;
          // Mark monthly expenses as applied
          expenses
            .filter((expense) => expense.monthlyKey)
            .forEach((expense) => {
              monthlyExpenses
                .filter((exp) => exp.key == expense.monthlyKey)
                .forEach((exp) => {
                  exp.applied = true;
                });
            });

          this.expensesSum =
            -1 *
            monthlyExpenses.reduce(
              (acc, cur) => acc + (cur.appliedAmount ?? cur.amount),
              0
            );
        });
    });
  }

  selectSection(section: string) {
    this.selectedSection = section; // Cambia el contenido mostrado
  }

  monthDecreased() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.loadData(this.currentDate);
  }

  monthIncreased() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.loadData(this.currentDate);
  }
}
