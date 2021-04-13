import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Transaction } from 'src/app/models';
import { ExpenseActions, IncomeActions, RecurringIncomeActions, MonthlyIncomeActions, RecurringExpenseActions } from 'src/app/state';
import { MonthlyExpenseActions } from 'src/app/state/expense/monthly.expense.actions';
import { ExpenseComponent, FiltersComponent, IncomeComponent, TransferComponent } from '../dialogs';

@Component({
  selector: 'transactions-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /* Animations */
  @Input() date: Date;
  @Output() onMonthIncreased: EventEmitter<any> = new EventEmitter();
  @Output() onMonthDecreased: EventEmitter<any> = new EventEmitter();
  @Output() onTextChanged: EventEmitter<string> = new EventEmitter();
  @ViewChild('searchInput') searchInput;
  searchOpen = false;
  searchText: String;
  constructor(public dialog: MatDialog, public store: Store) { }

  ngOnInit(): void {
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

  decreaseMonth(){
    this.onMonthDecreased.emit(null);
  }
  
  increaseMonth(){
    this.onMonthIncreased.emit(null);
  }

  onFilterTextChanged($event){
    const filterValue = ($event.target as HTMLInputElement).value;
    this.onTextChanged.emit(filterValue);
  }

  createIncomeDialog(){
    const dialogRef = this.dialog.open(IncomeComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)'
    });

    dialogRef.afterClosed().subscribe((incomeTransaction: Transaction) => {
      if(incomeTransaction){
        if(incomeTransaction.isMonthly){
          this.store.dispatch(new MonthlyIncomeActions.SaveMonthlyIncomeTransaction(incomeTransaction));
          if(incomeTransaction.applied){
            this.store.dispatch(new IncomeActions.SaveIncomeTransaction(incomeTransaction));
          }
        }else if(incomeTransaction.isRecurring){
          this.store.dispatch(new RecurringIncomeActions.SaveRecurringIncomeTransaction(incomeTransaction));          
        }else{
          this.store.dispatch(new IncomeActions.SaveIncomeTransaction(incomeTransaction));
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
        if(expenseTransaction.isMonthly){
          this.store.dispatch(new MonthlyExpenseActions.SaveMonthlyExpenseTransaction(expenseTransaction));

          if(expenseTransaction.applied){
            this.store.dispatch(new ExpenseActions.SaveExpenseTransaction(expenseTransaction));
          }
        }else if(expenseTransaction.isRecurring){
          this.store.dispatch(new RecurringExpenseActions.SaveRecurringExpenseTransaction(expenseTransaction));          
        }else{
          this.store.dispatch(new ExpenseActions.SaveExpenseTransaction(expenseTransaction));
        }
      }
    });
  }

  createTransferDialog() {
    const dialogRef = this.dialog.open(TransferComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Created transfer', result);
      } else {
        console.log('Nothing was created');
      }
    });
  }

  createFilterDialog(){
    const dialogRef = this.dialog.open(FiltersComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Filters', result);
      } else {
        console.log('No filters applies');
      }
    });
  }
}
