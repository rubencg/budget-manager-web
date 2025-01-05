import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction, TransactionTypes } from 'src/app/models';
import { PlannedExpense } from 'src/app/planned-expense';
import { IncomeState, ExpenseState } from 'src/app/state';

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
  // Planned expenes
  plannedExpenses$: Observable<PlannedExpense[]>;
  plannedExpenses: PlannedExpense[];
  plannedExpensesSum: number;
  expensesForTheMonth: Transaction[];
  // TODO: Get current date from control
  currentDate: Date = new Date();

  constructor(public store: Store) {
    
  }
  ngOnInit(): void {
    // Get incomes for the current month
    this.monthlyIncomes$ = this.store.select(
      IncomeState.selectMonthlyIncomeTransactionsForMonth(this.currentDate)
    );
    this.incomes$ = this.store.select(
      IncomeState.selectTransactionsForMonth(this.currentDate)
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
      ExpenseState.selectMonthlyExpenseTransactionsForMonth(
        this.currentDate,
        true
      )
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectTransactionsForMonth(this.currentDate)
    );
    this.expenses$.subscribe((expenses: Transaction[]) => {
      this.monthlyExpenses$
      .pipe(delay(0))
      .subscribe((monthlyExpenses: Transaction[]) => {
        // Used in sp-spending-plan-content
        this.expensesForTheMonth = expenses.filter(
          (t) => t.type == TransactionTypes.Expense
        );
        
        // Used in sp-summary-component
        this.allExpenses = monthlyExpenses;
        // Mark monthly expenses as applied
        expenses
        .filter((expense) => expense.monthlyKey)
        .forEach((expense) => {
          this.allExpenses
          .filter((exp) => exp.key == expense.monthlyKey)
          .forEach((exp) => {
            exp.applied = true;
          });
        });
        
        this.expensesSum =
        -1 * monthlyExpenses.reduce((acc, cur) => acc + cur.amount, 0);
      });
    });
    this.plannedExpenses$ = this.store.select(
      ExpenseState.selectPlannedExpenses()
    );
    this.plannedExpenses$.subscribe((plannedExpenses: PlannedExpense[]) => {
      this.plannedExpenses = plannedExpenses;
      this.plannedExpensesSum = plannedExpenses.reduce((acc, cur) => acc + cur.totalAmount, 0);
    });
  }

  selectSection(section: string) {
    this.selectedSection = section; // Cambia el contenido mostrado
  }
}
