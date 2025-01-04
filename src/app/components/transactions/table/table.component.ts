import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Transaction } from 'src/app/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import {
  ExpenseState,
  IncomeState,
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
  currentFilterText: string;

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
    

    this.transfers$ = (this.startDate && this.endDate) ?  this.store.select(TransferState.selectTransactionsForDates(this.startDate, this.endDate)) :
      this.store.select(TransferState.selectTransactionsForMonth(date));
    this.incomes$ = (this.startDate && this.endDate) ?  this.store.select(IncomeState.selectTransactionsForDates(this.startDate, this.endDate)) :
      this.store.select(IncomeState.selectTransactionsForMonth(date));
    this.expenses$ = (this.startDate && this.endDate) ?  this.store.select(ExpenseState.selectTransactionsForDates(this.startDate, this.endDate)) :
      this.store.select(ExpenseState.selectTransactionsForMonth(date));
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
                    const subcategory: string = data.subcategory
                      ? data.subcategory.toString()
                      : '';
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
                      .concat(subcategory)
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
                  if(this.currentFilterText && this.currentFilterText != ''){
                    this.applyFilter(this.currentFilterText);
                  }
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
    this.currentFilterText = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.loadTable(this.date);
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
