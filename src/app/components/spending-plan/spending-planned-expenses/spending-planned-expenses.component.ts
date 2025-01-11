import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Expense } from 'src/app/expense';
import { Transaction } from 'src/app/models';
import { PlannedExpense } from 'src/app/planned-expense';
import {
  ConfirmationDialogComponent,
  PlannedExpenseComponent,
} from '../../transactions/dialogs';
import { Store } from '@ngxs/store';
import { PlannedExpenseActions } from 'src/app/state/expense/planned-expense.actions';
import { getCategoryTextForPlannedExpense, isExpenseInPlannedExpense } from 'src/app/utils';

@Component({
  selector: 'app-spending-planned-expenses',
  templateUrl: './spending-planned-expenses.component.html',
  styleUrls: ['./spending-planned-expenses.component.scss'],
})
export class SpendingPlannedExpensesComponent implements OnInit {
  constructor(private dialog: MatDialog, public store: Store) {}

  @Input() plannedExpenses: PlannedExpense[];
  @Input() expenses: Transaction[];
  expensesAmountByCategoryMap: Map<string, Expense[]>;

  ngOnInit(): void {}

  getAmountLeft(plannedExpense: PlannedExpense): number {
    return plannedExpense.totalAmount - this.getSpentAmount(plannedExpense);
  }

  getPercentageLeft(plannedExpense: PlannedExpense): number {
    return (
      (this.getSpentAmount(plannedExpense) / plannedExpense.totalAmount) * 100
    );
  }

  getLeftText(plannedExpense: PlannedExpense): string {
    return this.getAmountLeft(plannedExpense) < 0 ? 'sobrepasado' : 'restante';
  }

  getSpentAmount(plannedExpense: PlannedExpense): number {
    if (this.expenses == undefined) return 0;

    let expensesForPlannedExpense = this.expenses.filter((e) =>
      isExpenseInPlannedExpense(plannedExpense, e)
    );

    return expensesForPlannedExpense.reduce((acc, cur) => acc + cur.amount, 0);
  }

  getCategoryText(plannedExpense: PlannedExpense): string {
    return getCategoryTextForPlannedExpense(plannedExpense);
  }

  delete(plannedExpense: PlannedExpense): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: '¿Estás seguro de que deseas eliminar este gasto planeado?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          new PlannedExpenseActions.DeletePlannedExpense(plannedExpense)
        );
      }
    });
  }

  modify(plannedExpense: PlannedExpense): void {
    const dialogRef = this.dialog.open(PlannedExpenseComponent, {
      data: plannedExpense,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((plannedExpense: PlannedExpense) => {
      if (plannedExpense) {
        this.store.dispatch(
          new PlannedExpenseActions.SavePlannedExpense(plannedExpense)
        );
      }
    });
  }
}
