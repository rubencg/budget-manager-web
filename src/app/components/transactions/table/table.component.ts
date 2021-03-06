import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from 'src/app/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../dialogs/delete/delete.component';
import { ApplyTransactionComponent, ExpenseComponent, IncomeComponent, TransferComponent } from '../dialogs';

const ELEMENT_DATA: Transaction[] = [
  {
    type: 'expense',
    applied: false,
    amount: 157.64,
    date: new Date(2020, 1, 3),
    account: 'Ruben Debito',
    notes: 'Pastillas para la alergia',
    category: 'Farmacia',
  },
  {
    type: 'income',
    applied: false,
    amount: 200.64,
    date: new Date(2021, 2, 3),
    account: 'Ruben Debito',
    notes: '',
    category: 'Salario',
  },
  {
    type: 'transfer',
    applied: true,
    amount: 100.59,
    date: new Date(2020, 2, 4),
    account: 'Ruben Debito',
    transferAccount: 'Sarahi Debito',
    notes: 'Transferencia de Sarahi Debito',
    category: 'Transferencia',
  },
  {
    type: 'transfer',
    applied: true,
    amount: -100.59,
    date: new Date(2020, 2, 4),
    account: 'Sarahi Debito',
    transferAccount: 'Ruben Debito',
    notes: 'Transferencia a Ruben Debito',
    category: 'Transferencia',
  },
  {
    type: 'expense',
    applied: true,
    amount: 257.64,
    date: new Date(2020, 1, 5),
    account: 'Ruben Debito',
    category: 'Farmacia',
  },
  {
    type: 'income',
    applied: true,
    amount: 300.64,
    date: new Date(2021, 2, 6),
    account: 'Ruben Debito',
    category: 'Farmacia',
  },
  {
    type: 'expense',
    applied: true,
    amount: 457.64,
    date: new Date(2020, 1, 7),
    account: 'Ruben Debito',
    category: 'Farmacia',
  },
  {
    type: 'income',
    applied: true,
    amount: 500.64,
    date: new Date(2021, 2, 8),
    account: 'Ruben Debito',
    category: 'Farmacia',
  },
  {
    type: 'expense',
    applied: true,
    amount: 657.64,
    date: new Date(2020, 1, 9),
    account: 'Ruben Debito',
    category: 'Farmacia',
  },
  {
    type: 'income',
    applied: true,
    amount: 700.64,
    date: new Date(2021, 2, 10),
    account: 'Ruben Debito',
    category: 'Farmacia',
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
  dataSource = new MatTableDataSource<Transaction>(ELEMENT_DATA);

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
      case 'expense':
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
      case 'transfer':
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
      case 'income':
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
      case 'expense':
        return 'expense-amount';
      case 'transfer':
        return 'transfer-amount';
      case 'income':
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
