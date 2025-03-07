import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Filter, Transaction } from 'src/app/models';
import {
  ExpenseActions,
  IncomeActions,
  RecurringIncomeActions,
  MonthlyIncomeActions,
  RecurringExpenseActions,
  TransferActions,
} from 'src/app/state';
import { MonthlyExpenseActions } from 'src/app/state/expense/monthly.expense.actions';
import {
  ExpenseComponent,
  FiltersComponent,
  IncomeComponent,
  PlannedExpenseComponent,
  SavingComponent,
  TransferComponent,
} from '../dialogs';
import { PlannedExpense } from 'src/app/planned-expense';
import { PlannedExpenseActions } from 'src/app/state/expense/planned-expense.actions';
import { Saving } from 'src/app/saving';
import { SavingActions } from 'src/app/state/expense/saving-actions';

export enum HeaderFeatures {
  SearchButton = 'SearchButton',
  AddIncome = 'AddIncome',
  AddExpense = 'AddExpense',
  AddTransfer = 'AddTransfer',
  AddPlannedExpense = 'AddPlannedExpense',
  AddSaving = 'AddSaving',
  FilterButton = 'FilterButton',
}

@Component({
  selector: 'transactions-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /* Animations */
  @Input() date: Date;
  @Input() displayFeatures: Record<HeaderFeatures, boolean>;

  startDate: Date;
  endDate: Date;
  @Output() onMonthIncreased: EventEmitter<any> = new EventEmitter();
  @Output() onMonthDecreased: EventEmitter<any> = new EventEmitter();
  @Output() onTextChanged: EventEmitter<string> = new EventEmitter();
  @Output() onFilter: EventEmitter<Filter> = new EventEmitter();
  @ViewChild('searchInput') searchInput;
  searchOpen = false;
  searchText: String;
  constructor(
    public dialog: MatDialog,
    public store: Store,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.startDate = params['startDate'] ? new Date(params['startDate']) : undefined;
      this.endDate = params['endDate'] ? new Date(params['endDate']) : undefined;
    });
  }

  displaySearch($event) {
    let input = this.searchInput.nativeElement;
    if (this.isHidden(input) && $event.type == 'click') {
      this.searchOpen = !this.searchOpen;
      setTimeout(() => {
        input.focus();
      }, 510);
    } else if ($event.type == 'focusout') {
      if (this.searchText == '' || this.searchText == undefined) {
        this.searchOpen = !this.searchOpen;
      }
    }
  }

  isHidden(el) {
    var style = window.getComputedStyle(el);
    return style.display === 'none';
  }

  decreaseMonth() {
    this.onMonthDecreased.emit(null);
  }

  increaseMonth() {
    this.onMonthIncreased.emit(null);
  }

  onFilterTextChanged($event) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.onTextChanged.emit(filterValue);
  }

  createIncomeDialog() {
    const dialogRef = this.dialog.open(IncomeComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((incomeTransaction: Transaction) => {
      if (incomeTransaction) {
        if (incomeTransaction.isMonthly) {
          this.store.dispatch(
            new MonthlyIncomeActions.SaveMonthlyIncomeTransaction(
              incomeTransaction
            )
          );
          if (incomeTransaction.applied) {
            this.store.dispatch(
              new IncomeActions.SaveIncomeTransaction(incomeTransaction)
            );
          }
        } else if (incomeTransaction.isRecurring) {
          this.store.dispatch(
            new RecurringIncomeActions.SaveRecurringIncomeTransaction(
              incomeTransaction
            )
          );
        } else {
          this.store.dispatch(
            new IncomeActions.SaveIncomeTransaction(incomeTransaction)
          );
        }
      }
    });
  }

  createExpenseDialog() {
    const dialogRef = this.dialog.open(ExpenseComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((expenseTransaction: Transaction) => {
      if (expenseTransaction) {
        if (expenseTransaction.isMonthly) {
          this.store.dispatch(
            new MonthlyExpenseActions.SaveMonthlyExpenseTransaction(
              expenseTransaction
            )
          );

          if (expenseTransaction.applied) {
            this.store.dispatch(
              new ExpenseActions.SaveExpenseTransaction(expenseTransaction)
            );
          }
        } else if (expenseTransaction.isRecurring) {
          this.store.dispatch(
            new RecurringExpenseActions.SaveRecurringExpenseTransaction(
              expenseTransaction
            )
          );
        } else {
          this.store.dispatch(
            new ExpenseActions.SaveExpenseTransaction(expenseTransaction)
          );
        }
      }
    });
  }

  createPlannedSpendingDialog() {
    const dialogRef = this.dialog.open(PlannedExpenseComponent, {
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

  createSavingDialog() {
    const dialogRef = this.dialog.open(SavingComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((saving: Saving) => {
      if (saving) {
        this.store.dispatch(
          new SavingActions.SaveSaving(saving)
        );
      }
    });
  }

  createTransferDialog() {
    const dialogRef = this.dialog.open(TransferComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((transaction: Transaction) => {
      if (transaction) {
        this.store.dispatch(
          new TransferActions.SaveTransferTransaction(transaction)
        );
      }
    });
  }

  createFilterDialog() {
    const dialogRef = this.dialog.open(FiltersComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((result: Filter) => {
      if (result) {
        this.onFilter.emit(result);
      }
    });
  }
}
