import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Transaction, TransactionTypes } from 'src/app/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../dialogs/delete/delete.component';
import { ApplyTransactionComponent, ExpenseComponent, IncomeComponent, TransferComponent } from '../dialogs';
import { Select, Store } from '@ngxs/store';
import { IncomeState, TransferState } from 'src/app/state';
import { Observable } from 'rxjs';

const ELEMENT_DATA: Transaction[] = [
  {
    type: TransactionTypes.Expense,
    applied: false,
    amount: 157.64,
    date: new Date(2020, 1, 3),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    notes: 'Pastillas para la alergia',
    category: {
      name: 'Farmacia',
      image: 'capsules',
      color: '#eb4034'
    },
  },
  {
    type: TransactionTypes.Income,
    applied: false,
    amount: 200.64,
    date: new Date(2021, 2, 3),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    notes: '',
    category: {
      name: 'Salario',
      image: 'money-check-alt',
      color: '#34eb83'
    },
  },
  {
    type: TransactionTypes.Transfer,
    applied: true,
    amount: 100.59,
    date: new Date(2020, 2, 4),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    transferAccount: {
      name: 'Sarahi Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    notes: 'Transferencia a Sarahi Debito',
    category: {
      name: 'Transferencia',
      image: ''
    },
  },
  {
    type: TransactionTypes.Expense,
    applied: true,
    amount: 257.64,
    date: new Date(2020, 1, 5),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    category: {
      name: 'Farmacia',
      image: 'capsules',
      color: '#eb4034'
    },
  },
  {
    type: TransactionTypes.Income,
    applied: true,
    amount: 300.64,
    date: new Date(2021, 2, 6),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    category: {
      name: 'Farmacia',
      image: 'capsules',
      color: '#eb4034'
    },
  },
  {
    type: TransactionTypes.Expense,
    applied: true,
    amount: 457.64,
    date: new Date(2020, 1, 7),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    category: {
      name: 'Farmacia',
      image: 'capsules',
      color: '#eb4034'
    },
  },
  {
    type: TransactionTypes.Income,
    applied: true,
    amount: 500.64,
    date: new Date(2021, 2, 8),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    category: {
      name: 'Farmacia',
      image: 'capsules',
      color: '#eb4034'
    },
  },
  {
    type: TransactionTypes.Expense,
    applied: true,
    amount: 657.64,
    date: new Date(2020, 1, 9),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    category: {
      name: 'Farmacia',
      image: 'capsules',
      color: '#eb4034'
    },
  },
  {
    type: TransactionTypes.Income,
    applied: true,
    amount: 700.64,
    date: new Date(2021, 2, 10),
    account: {
      name: 'Ruben Debito',
      color: '#3477eb',
      image: 'piggy-bank'
    },
    category: {
      name: 'Farmacia',
      image: 'capsules',
      color: '#eb4034'
    },
  },
];

@Component({
  selector: 'transactions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnInit {
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

  @Select(TransferState.selectTransactionsForMonth(new Date()))
  transfers$: Observable<Transaction[]>;
  @Select(IncomeState.selectTransactionsForMonth(new Date()))
  incomes$: Observable<Transaction[]>;

  constructor(public dialog: MatDialog, public store: Store) {}

  ngOnInit(): void {
    this.transfers$.subscribe((transfers: Transaction[]) => {
      this.incomes$.subscribe((incomes: Transaction[]) => {
        this.dataSource = new MatTableDataSource<Transaction>(transfers.concat(incomes));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    });
  }

  ngAfterViewInit() {
  }

  deleteDialog(transaction: Transaction) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: transaction,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log('Deleting transaction', transaction);
      } else {
        console.log('Nothing was deleted');
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
          autoFocus: false
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
          autoFocus: false
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
          autoFocus: false
        });
        incomeDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log('Edit income', result);
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

  applyTransaction(transaction: Transaction){
    const applyTransactionDialogRef = this.dialog.open(ApplyTransactionComponent, {
      data: transaction,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      autoFocus: false
    });
    applyTransactionDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Apply transaction', result);
      } else {
        console.log('Transaction not applied');
      }
    });
  }
}
