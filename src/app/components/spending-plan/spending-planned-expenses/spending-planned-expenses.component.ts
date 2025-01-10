import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models';
import { PlannedExpense } from 'src/app/planned-expense';

@Component({
  selector: 'app-spending-planned-expenses',
  templateUrl: './spending-planned-expenses.component.html',
  styleUrls: ['./spending-planned-expenses.component.scss'],
})
export class SpendingPlannedExpensesComponent implements OnInit {
  constructor() {}

  @Input() plannedExpenses: PlannedExpense[];
  @Input() expenses: Transaction[];

  ngOnInit(): void {
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

  getSpentPercentage(plannedExpense: PlannedExpense): number {
    // return (plannedExpense.remainingAmount / plannedExpense.totalAmount) * 100
    return 20;
  }
}
