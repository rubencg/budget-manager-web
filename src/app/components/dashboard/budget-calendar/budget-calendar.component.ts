import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction, TransactionTypes } from 'src/app/models';
import { ExpenseState, IncomeState, TransferState } from 'src/app/state';
import * as _ from 'lodash';

@Component({
  selector: 'budget-calendar',
  templateUrl: './budget-calendar.component.html',
  styleUrls: ['./budget-calendar.component.scss'],
})
export class BudgetCalendarComponent implements OnInit {
  @Output() onDateChanged: EventEmitter<Date> = new EventEmitter();

  transfers$: Observable<Transaction[]>;
  incomes$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
  monthlyIncomes$: Observable<Transaction[]>;
  monthlyExpenses$: Observable<Transaction[]>;

  constructor(public store: Store,
    private router: Router) {}

  ngOnInit(): void {
    this.loadCalendarEvents(this.viewDate);
  }

  loadCalendarEvents(date: Date){
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
                let source = transfers
                        .concat(incomes)
                        .concat(monthlyExpenses)
                        .concat(monthlyIncomes)
                        .concat(expenses);
                this.events = [];

                source.forEach(t => {
                  let event = this.events.find(e => e.start.getDate() == t.date.getDate()
                    && e.cssClass == this.getCssClassByType(t));
                  if(!event){
                    this.events.push({
                      title: '',
                      start: t.date,
                      cssClass: this.getCssClassByType(t)
                    });
                  }
                });
              });
            });
          });
        });
      });
  }

  getCssClassByType(transaction: Transaction){
    switch (transaction.type) {
      case TransactionTypes.Income:
        return transaction.applied ? 'day day-with-incomes' : 'day day-with-unpaid-incomes';
      case TransactionTypes.Expense:
        return transaction.applied ? 'day day-with-expenses' : 'day day-with-unpaid-expenses';
      case TransactionTypes.Transfer:
        return 'day day-with-transfers';
      case TransactionTypes.MonthlyIncome:
        return 'day day-with-unpaid-incomes';
      case TransactionTypes.MonthlyExpense:
        return 'day day-with-unpaid-expenses';
    }
  }

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.router.navigate(['/transactions'], {
      queryParams: {
        startDate: date.toISOString(),
        endDate: date.toISOString(),
      },
    });
  }

  dateChanged(){
    this.onDateChanged.emit(this.viewDate);
    this.loadCalendarEvents(this.viewDate);
  }
}
