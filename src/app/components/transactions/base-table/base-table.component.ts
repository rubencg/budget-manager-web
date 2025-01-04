import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction, TransactionTypes } from 'src/app/models';
import { MatPaginator } from '@angular/material/paginator';
import {
  ApplyTransactionComponent,
  DeleteComponent,
  ExpenseComponent,
  IncomeComponent,
  TransferComponent,
} from '../dialogs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import {
  ExpenseActions,
  IncomeActions,
  MonthlyExpenseActions,
  MonthlyIncomeActions,
  TransferActions,
} from 'src/app/state';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
})
export class BaseTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() dataSource = new MatTableDataSource<Transaction>();
  @Input() displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, public store: Store) {}

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngOnChanges(): void {
    // Configura paginator y sort si cambian
    this.updateDataSource();
  }

  ngAfterViewInit(): void {
    // Configura paginator y sort después de la inicialización de la vista
    this.updateDataSource();
  }

  private updateDataSource(): void {
    if (this.dataSource) {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  deleteDialog(transaction: Transaction) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: transaction,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        switch (transaction.type) {
          case TransactionTypes.Expense:
            this.store.dispatch(new ExpenseActions.DeleteExpense(transaction));
            break;
          case TransactionTypes.Transfer:
            this.store.dispatch(
              new TransferActions.DeleteTransfer(transaction)
            );
            break;
          case TransactionTypes.Income:
            this.store.dispatch(new IncomeActions.DeleteIncome(transaction));
            break;
          case TransactionTypes.MonthlyIncome:
            this.store.dispatch(
              new MonthlyIncomeActions.DeleteMonthlyIncome(transaction)
            );
            break;
          case TransactionTypes.MonthlyExpense:
            this.store.dispatch(
              new MonthlyExpenseActions.DeleteMonthlyExpense(transaction)
            );
            break;
        }
      }
    });
  }

  editTransaction(transaction: Transaction) {
    switch (transaction.type) {
      case TransactionTypes.Expense:
        const expenseDialogRef = this.dialog.open(ExpenseComponent, {
          data: transaction,
          maxWidth: '600px',
          width: 'calc(100% - 64px)',
          autoFocus: false,
        });
        expenseDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.store.dispatch(
              new ExpenseActions.SaveExpenseTransaction(result)
            );
          }
        });
        break;
      case TransactionTypes.Transfer:
        const transferDialogRef = this.dialog.open(TransferComponent, {
          data: transaction,
          maxWidth: '600px',
          width: 'calc(100% - 64px)',
          autoFocus: false,
        });
        transferDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.store.dispatch(
              new TransferActions.SaveTransferTransaction(result)
            );
          }
        });
        break;
      case TransactionTypes.Income:
        const incomeDialogRef = this.dialog.open(IncomeComponent, {
          data: transaction,
          maxWidth: '600px',
          width: 'calc(100% - 64px)',
          autoFocus: false,
        });
        incomeDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.store.dispatch(
              new IncomeActions.SaveIncomeTransaction(result)
            );
          }
        });
        break;
      // ToDo: Modify monthly incomes and expenses
    }
  }

  getAmountClassByType(transaction: Transaction) {
    switch (transaction.type) {
      case TransactionTypes.Expense:
        return transaction.applied ? 'expense-amount' : 'not-applied-amount';
      case TransactionTypes.MonthlyExpense:
        return 'not-applied-amount';
      case TransactionTypes.Transfer:
        return 'transfer-amount';
      case TransactionTypes.Income:
      case TransactionTypes.MonthlyIncome:
        return transaction.applied
          ? 'income-amount'
          : 'not-applied-income-amount';
      default:
        return '';
    }
  }

  applyTransaction(transaction: Transaction) {
    const applyTransactionDialogRef = this.dialog.open(
      ApplyTransactionComponent,
      {
        data: transaction,
        maxWidth: '600px',
        width: 'calc(100% - 64px)',
        autoFocus: false,
      }
    );
    applyTransactionDialogRef
      .afterClosed()
      .subscribe((transaction: Transaction) => {
        if (transaction) {
          switch (transaction.type) {
            case TransactionTypes.Expense:
              this.store.dispatch(
                new ExpenseActions.ApplyExpenseTransaction(transaction)
              );
              break;
            case TransactionTypes.MonthlyIncome:
              transaction.monthlyKey = transaction.key;
              this.store.dispatch(
                new IncomeActions.ApplyIncomeTransaction(transaction)
              );
              break;
            case TransactionTypes.MonthlyExpense:
              transaction.monthlyKey = transaction.key;
              this.store.dispatch(
                new ExpenseActions.ApplyExpenseTransaction(transaction)
              );
              break;
            case TransactionTypes.Income:
              this.store.dispatch(
                new IncomeActions.ApplyIncomeTransaction(transaction)
              );
              break;
            default:
              return '';
          }
        }
      });
  }
}
