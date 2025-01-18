import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Expense } from 'src/app/expense';
import { PlannedExpense } from 'src/app/planned-expense';
import {
  ConfirmationDialogComponent,
  ExpenseComponent,
  PlannedExpenseComponent,
} from '../../transactions/dialogs';
import { Store } from '@ngxs/store';
import { PlannedExpenseActions } from 'src/app/state/expense/planned-expense.actions';
import { compareTransactionsByDate, getCategoryTextForPlannedExpense } from 'src/app/utils';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Transaction } from 'src/app/models';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseActions } from 'src/app/state';

@Component({
  selector: 'app-spending-planned-expenses',
  templateUrl: './spending-planned-expenses.component.html',
  styleUrls: ['./spending-planned-expenses.component.scss'],
})
export class SpendingPlannedExpensesComponent implements OnChanges, AfterViewInit {
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
          'actions',
        ];
  }

  ngAfterViewInit(): void {
    this.setCurrentTransactionsSource();
  }

  @Input() plannedExpenses: PlannedExpense[];
  @Input() expensesByCategory: Map<string, Expense[]> = new Map();
  currentTransactionsSource = new MatTableDataSource<Transaction>();
  displayedColumns: string[];
  allExpenses: Transaction[] = [];
  selectedCategory: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expensesByCategory']) {
      const eByCat: Map<string, Transaction[]> = changes['expensesByCategory']
        .currentValue as unknown as Map<string, Transaction[]>;
      this.allExpenses = [];
      for (const expensesArray of eByCat.values()) {
        this.allExpenses.push(...expensesArray);
      }

      this.setCurrentTransactionsSource();
    }
  }

  private setCurrentTransactionsSource(): void {
    const transactions = ((this.selectedCategory == ''
      ? this.allExpenses
      : this.expensesByCategory.get(
          this.selectedCategory
        )) as unknown as Transaction[]) ?? [];

    this.currentTransactionsSource = new MatTableDataSource<Transaction>(
      transactions.sort(compareTransactionsByDate)
    )
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
  
  create(plannedExpense: PlannedExpense): void {
    const dialogRef = this.dialog.open(ExpenseComponent, {
      data: {
        amount: 0,
        date: new Date(),
        category: plannedExpense.category,
        subcategory: plannedExpense.subCategory,
      } as Transaction,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((expense: Transaction) => {
      if (expense) {
        this.store.dispatch(
          new ExpenseActions.SaveExpenseTransaction(expense)
        );
      }
    });
  }

  getFilterButtonText(plannedExpense: PlannedExpense): string {
    return this.selectedCategory ==
      getCategoryTextForPlannedExpense(plannedExpense)
      ? 'Borrar filtro'
      : 'Filtrar solo estos';
  }

  filterTransactions(plannedExpense: PlannedExpense): void {
    let category = getCategoryTextForPlannedExpense(plannedExpense);
    if (this.selectedCategory == category) {
      this.selectedCategory = '';
    } else {
      this.selectedCategory = category;
    }

    this.setCurrentTransactionsSource();
  }
}
