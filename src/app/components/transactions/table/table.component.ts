import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Transaction, TransactionTypes } from 'src/app/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../dialogs/delete/delete.component';
import {
  ApplyTransactionComponent,
  ExpenseComponent,
  IncomeComponent,
  TransferComponent,
} from '../dialogs';
import { Select, Store } from '@ngxs/store';
import { ExpenseState, IncomeActions, IncomeState, TransferState } from 'src/app/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'transactions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnInit {
  @Input() date: Date;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'date',
    'category',
    'account',
    'amount',
    'notes',
    'actions',
  ];
  dataSource = new MatTableDataSource<Transaction>();

  transfers$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;

  constructor(public dialog: MatDialog, public store: Store) {}

  ngOnInit(): void {
    this.loadTable(this.date);
  }

  public loadTable(date: Date) {
    this.transfers$ = this.store.select(
      TransferState.selectTransactionsForMonth(date)
    );
    this.incomes$ = this.store.select(
      IncomeState.selectTransactionsForMonth(date)
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectTransactionsForMonth(date)
    );
    this.transfers$.subscribe((transfers: Transaction[]) => {
      this.incomes$.subscribe((incomes: Transaction[]) => {
        this.expenses$.subscribe((expenses: Transaction[]) => {
          this.dataSource = new MatTableDataSource<Transaction>(
            transfers.concat(incomes).concat(expenses).sort(compareTransactions)
          );
          this.dataSource.filterPredicate = (data: Transaction, filter: string) => {
            const category: string = data.category ? data.category.name.toString() : '';
            const amount: string = data.amount ? data.amount.toString() : '';
            const account: string = data.account ? data.account.name.toString() : '';
            const transferAccount: string = data.transferAccount ? data.transferAccount.name.toString() : '';
            const notes: string = data.notes ? data.notes.toString() : '';

            const transactionData = category.concat(amount).concat(account).concat(transferAccount).concat(notes);
            return !filter || transactionData.toLowerCase().indexOf(filter) != -1;
          };
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {}

  deleteDialog(transaction: Transaction) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: transaction,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        switch (transaction.type) {
          case TransactionTypes.Expense:
            // ToDo: Delete Expense
            break;
          case TransactionTypes.Transfer:
            // ToDo: Delete Transfer
            break;
          case TransactionTypes.Income:
            this.store.dispatch(new IncomeActions.DeleteIncome(transaction))
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
            console.log('Edit expense', result);
          } else {
            console.log('Dont edit expense');
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
            console.log('Edit transfer', result);
          } else {
            console.log('Dont edit transfer');
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
            this.store.dispatch(new IncomeActions.SaveIncomeTransaction(result))
          } else {
            console.log('Dont edit income');
          }
        });
        break;
    }
  }

  getAmountClassByType(transaction: Transaction) {
    switch (transaction.type) {
      case TransactionTypes.Expense:
        return 'expense-amount';
      case TransactionTypes.Transfer:
        return 'transfer-amount';
      case TransactionTypes.Income:
        return 'income-amount';
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
    applyTransactionDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Apply transaction', result);
      } else {
        console.log('Transaction not applied');
      }
    });
  }
}

function compareTransactions(a: Transaction, b: Transaction) {
  if (a.date > b.date) {
    return -1;
  }
  if (a.date < b.date) {
    return 1;
  }
  return 0;
}
