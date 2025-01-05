import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Transaction, TransactionTypes } from 'src/app/models';
import { PlannedExpense } from 'src/app/planned-expense';
import { ExpenseState } from 'src/app/state';

@Component({
  selector: 'app-spending-planned-expenses',
  templateUrl: './spending-planned-expenses.component.html',
  styleUrls: ['./spending-planned-expenses.component.scss'],
})
export class SpendingPlannedExpensesComponent implements OnInit {
  constructor(public store: Store) {}

  currentDate: Date = new Date();
  plannedExpensesSum: number;
  @Output() plannedExpensesSumChange: EventEmitter<number> = new EventEmitter<number>();

  plannedExpenses$: Observable<PlannedExpense[]>;
  allPlannedExpenses: PlannedExpense[];
  expenses$: Observable<Transaction[]>;
  expenses: Transaction[];

  ngOnInit(): void {
    this.plannedExpenses$ = this.store.select(
      ExpenseState.selectPlannedExpenses()
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectTransactionsForMonth(this.currentDate)
    );

    this.plannedExpenses$.subscribe((plannedExpenses: PlannedExpense[]) => {
      this.allPlannedExpenses = plannedExpenses;
      this.plannedExpensesSum = plannedExpenses.reduce((acc, cur) => acc + cur.totalAmount, 0);
      this.plannedExpensesSumChange.emit(this.plannedExpensesSum);
    });
    this.expenses$.subscribe((transactions: Transaction[]) => {
      this.expenses = transactions.filter(
        (t) => t.type == TransactionTypes.Expense
      );
    });
  }

  getSpentAmount(plannedExpense: PlannedExpense): number {
    let expensesForPlannedExpense = this.expenses.filter(
      (e) =>
        e.category.name == plannedExpense.category.name &&
        (plannedExpense.subCategory == null ||
          plannedExpense.subCategory == e.subcategory)
    );

    return expensesForPlannedExpense.reduce((acc, cur) => acc + cur.amount, 0);
  }

  getCategoryText(plannedExpense: PlannedExpense): string {
    let subCategory = plannedExpense.subCategory == null 
      || plannedExpense.subCategory == undefined
      || plannedExpense.subCategory == "" ? "" : ` - ${plannedExpense.subCategory}`
    
    return `${plannedExpense.category.name}${subCategory}`;
  }
}
