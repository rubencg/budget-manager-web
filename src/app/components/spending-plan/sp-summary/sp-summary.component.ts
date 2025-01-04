import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/models';
import { ExpenseState, IncomeState } from 'src/app/state';

@Component({
  selector: 'app-sp-summary',
  templateUrl: './sp-summary.component.html',
  styleUrls: ['./sp-summary.component.scss']
})
export class SpSummaryComponent implements OnInit {
  monthlyIncomes$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  incomesSum: number = 0;
  monthlyExpenses$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
  expensesSum: number = 0;
  // TODO: Get current date from control
  currentDate: Date = new Date();

  constructor(public store: Store) { }

  ngOnInit(): void {
    // Get incomes for the current month
    this.monthlyIncomes$ = this.store.select(
      IncomeState.selectMonthlyIncomeTransactionsForMonth(this.currentDate)
    );
    this.incomes$ = this.store.select(
      IncomeState.selectTransactionsForMonth(this.currentDate)
    );
    this.monthlyIncomes$.subscribe((monthlyIncomes: Transaction[]) => {
      this.incomes$.subscribe((incomes: Transaction[]) => {
        this.incomesSum = monthlyIncomes
          .concat(incomes)
          .reduce((acc, cur) => acc + cur.amount, 0);
      });  
    });

    // Get expenses for the current month
    this.monthlyExpenses$ = this.store.select(
      ExpenseState.selectMonthlyExpenseTransactionsForMonth(this.currentDate)
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectTransactionsForMonth(this.currentDate)
    );
    this.monthlyExpenses$.subscribe((monthlyExpenses: Transaction[]) => {
      this.expenses$.subscribe((expenses: Transaction[]) => {
        this.expensesSum = (-1) * monthlyExpenses
          .concat(expenses)
          .reduce((acc, cur) => acc + cur.amount, 0);
      });  
    });
  }

}
