import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models';
import { PlannedExpense } from 'src/app/planned-expense';
import { isExpenseInPlannedExpense } from 'src/app/utils';

@Component({
  selector: 'remaining-progress',
  templateUrl: './remaining-progress.component.html',
  styleUrls: ['./remaining-progress.component.scss']
})
export class RemainingProgressComponent implements OnInit {
  @Input() plannedExpense: PlannedExpense
  @Input() expenses: Transaction[]

  constructor() { }

  ngOnInit(): void {
    
  }

  get spentAmount(): number {
    if (this.expenses == undefined) return 0
    
    let expensesForPlannedExpense = this.expenses.filter((e) =>
      isExpenseInPlannedExpense(this.plannedExpense, e)
    );

    return expensesForPlannedExpense.reduce((acc, cur) => acc + cur.amount, 0);
  }

  get spentPercentage() {
    return (this.spentAmount / this.plannedExpense.totalAmount) * 100;
  }
}
