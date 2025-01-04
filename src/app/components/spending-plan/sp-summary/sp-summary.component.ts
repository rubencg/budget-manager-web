import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction } from 'src/app/models';
import { ExpenseState, IncomeState } from 'src/app/state';

@Component({
  selector: 'app-sp-summary',
  templateUrl: './sp-summary.component.html',
  styleUrls: ['./sp-summary.component.scss'],
})
export class SpSummaryComponent implements OnInit {
  monthlyIncomes$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  allIncomes: Transaction[];
  incomesSum: number = 0;
  monthlyExpenses$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
  allExpenses: Transaction[];
  expensesSum: number = 0;
  displayedColumns: string[] = [
    'date',
    'category',
    'account',
    'amount',
    'notes',
    'applied',
    'actions',
  ];
  // TODO: Get current date from control
  currentDate: Date = new Date();

  constructor(public store: Store) {}

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
  }
}
