import { Component, Input, OnInit } from '@angular/core';
import { Expense } from 'src/app/expense';
import { PlannedExpense } from 'src/app/planned-expense';
import {
  getCategoryTextForPlannedExpense,
  isExpenseInPlannedExpense,
} from 'src/app/utils';

@Component({
  selector: 'remaining-progress',
  templateUrl: './remaining-progress.component.html',
  styleUrls: ['./remaining-progress.component.scss'],
})
export class RemainingProgressComponent implements OnInit {
  @Input() plannedExpense: PlannedExpense;
  @Input() expensesByCategory: Map<string, Expense[]> = new Map();

  constructor() {}

  ngOnInit(): void {}

  get spentAmount(): number {
    const category = getCategoryTextForPlannedExpense(this.plannedExpense);

    if (
      this.expensesByCategory == undefined ||
      !this.expensesByCategory.has(category)
    )
      return 0;

    return this.expensesByCategory
      .get(category)
      .reduce((acc, cur) => acc + cur.amount, 0);
  }

  get spentPercentage() {
    return (this.spentAmount / this.plannedExpense.totalAmount) * 100;
  }
}
