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
import {
  ExpenseActions,
  ExpenseState,
  IncomeActions,
  IncomeState,
  MonthlyExpenseActions,
  MonthlyIncomeActions,
  TransferActions,
  TransferState,
} from 'src/app/state';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'transactions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnInit {
  @Input() date: Date;
  showNotAppliedTransactions: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Transaction>();

  // Params
  startDate: Date;
  endDate: Date;
  categories: string[];
  accounts: string[];
  types: string[];

  transfers$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
  monthlyIncomes$: Observable<Transaction[]>;
  monthlyExpenses$: Observable<Transaction[]>;

  constructor(
    public dialog: MatDialog,
    public store: Store,
    private deviceService: DeviceDetectorService,
    private activatedRoute: ActivatedRoute
  ) {
    this.displayedColumns = this.deviceService.isMobile()
      ? ['transaction-content']
      : ['date', 'category', 'account', 'amount', 'notes', 'actions'];
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.startDate = params['startDate'] ? new Date(params['startDate']) : undefined;
      this.endDate = params['endDate'] ? new Date(params['endDate']) : undefined;
      this.categories = params['categories'] ? params['categories'].split(',') : undefined;
      this.accounts = params['accounts'] ? params['accounts'].split(',') : undefined;
      this.types = params['types'] ? params['types'].split(',') : undefined;
    });
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
    this.monthlyIncomes$ = this.store.select(
      IncomeState.selectMonthlyIncomeTransactionsForMonth(date)
    );
    this.monthlyExpenses$ = this.store.select(
      ExpenseState.selectMonthlyExpenseTransactionsForMonth(date)
    );
    this.transfers$.subscribe((transfers: Transaction[]) => {
      this.incomes$.subscribe((incomes: Transaction[]) => {
        this.expenses$.subscribe((expenses: Transaction[]) => {
          this.monthlyExpenses$.subscribe((monthlyExpenses: Transaction[]) => {
            this.monthlyIncomes$
              .pipe(delay(0))
              .subscribe((monthlyIncomes: Transaction[]) => {
                

                  let source = this.showNotAppliedTransactions
                    ? transfers
                        .concat(incomes)
                        .concat(monthlyExpenses)
                        .concat(monthlyIncomes)
                        .concat(expenses)
                        .sort(compareTransactions)
                    : transfers
                        .concat(incomes.filter((i) => i.applied))
                        .concat(expenses.filter((i) => i.applied))
                        .sort(compareTransactions);

                  source = this.filterWithQueryParams(source);

                  this.dataSource = new MatTableDataSource<Transaction>(source);
                  this.dataSource.filterPredicate = (
                    data: Transaction,
                    filter: string
                  ) => {
                    const category: string = data.category
                      ? data.category.name.toString()
                      : '';
                    const amount: string = data.amount
                      ? data.amount.toString()
                      : '';
                    const account: string = data.account
                      ? data.account.name.toString()
                      : '';
                    const transferAccount: string = data.transferAccount
                      ? data.transferAccount.name.toString()
                      : '';
                    const notes: string = data.notes
                      ? data.notes.toString()
                      : '';

                    const transactionData = category
                      .concat(amount)
                      .concat(account)
                      .concat(transferAccount)
                      .concat(notes);
                    return (
                      !filter ||
                      transactionData.toLowerCase().indexOf(filter) != -1
                    );
                  };
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
              });
          });
        });
      });
    });
  }

  filterWithQueryParams(source: Transaction[]){
    if(this.startDate && this.endDate){
      source = source.filter(t => 
        t.date.getFullYear() >= this.startDate.getFullYear()
        && t.date.getMonth() >= this.startDate.getMonth()
        && t.date.getDate() >= this.startDate.getDate()
        && t.date.getFullYear() <= this.endDate.getFullYear()
        && t.date.getMonth() <= this.endDate.getMonth()
        && t.date.getDate() <= this.endDate.getDate()
      )
    }

    if(this.categories){
      source = source.filter(t => t.category && this.categories.includes(t.category.name));
    }
    
    if(this.accounts){
      source = source.filter(t => (t.account && this.accounts.includes(t.account.name))
      || (t.transferAccount && this.accounts.includes(t.transferAccount.name)));
    }

    if(this.types){
      source = source.filter(t => this.types.includes(t.type.toString()));
    }

    return source;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.loadTable(this.date);
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
      case TransactionTypes.MonthlyExpense:
        return transaction.applied ? 'expense-amount' : 'not-applied-amount';
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

  appliedTransactionsToggleChanged($event: MatSlideToggleChange) {

    this.showNotAppliedTransactions = $event.checked;
    this.loadTable(this.date);
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
