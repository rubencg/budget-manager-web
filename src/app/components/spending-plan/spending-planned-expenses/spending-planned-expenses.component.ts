import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Expense } from 'src/app/expense';
import { PlannedExpense } from 'src/app/planned-expense';
import {
  ConfirmationDialogComponent,
  PlannedExpenseComponent,
} from '../../transactions/dialogs';
import { Store } from '@ngxs/store';
import { PlannedExpenseActions } from 'src/app/state/expense/planned-expense.actions';
import { getCategoryTextForPlannedExpense } from 'src/app/utils';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Transaction } from 'src/app/models';

@Component({
  selector: 'app-spending-planned-expenses',
  templateUrl: './spending-planned-expenses.component.html',
  styleUrls: ['./spending-planned-expenses.component.scss'],
})
export class SpendingPlannedExpensesComponent implements OnChanges {
  constructor(
    private dialog: MatDialog,
    public store: Store,
    private deviceService: DeviceDetectorService
  ) {
    this.displayedColumns = this.deviceService.isMobile()
      ? ['transaction-content']
      : [
          'date',
          'category',
          'account',
          'amount',
          'notes',
          'applied',
          'actions',
        ];
  }

  @Input() plannedExpenses: PlannedExpense[];
  @Input() expensesByCategory: Map<string, Expense[]> = new Map();
  displayedColumns: string[];
  filteredExpenses: Transaction[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expensesByCategory']) {
      const eByCat: Map<string, Transaction[]> = changes['expensesByCategory']
        .currentValue as unknown as Map<string, Transaction[]>;
      this.filteredExpenses = [];
      for (const expensesArray of eByCat.values()) {
        this.filteredExpenses.push(...expensesArray);
      }
    }
  }

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
    const category = getCategoryTextForPlannedExpense(plannedExpense);

    if (
      this.expensesByCategory == undefined ||
      !this.expensesByCategory.has(category)
    )
      return 0;

    return this.expensesByCategory
      .get(category)
      .reduce((acc, cur) => acc + cur.amount, 0);
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
