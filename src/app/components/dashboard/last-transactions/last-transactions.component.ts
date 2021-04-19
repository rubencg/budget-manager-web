import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { concat, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Transaction, TransactionTypes } from 'src/app/models';
import { ExpenseState, IncomeState, TransferState } from 'src/app/state';

@Component({
  selector: 'last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss'],
})
export class LastTransactionsComponent implements OnInit {
  data: Transaction[] = [];
  date: Date = new Date();
  incomes$: Observable<Transaction[]>;
  expenses$: Observable<Transaction[]>;
  transfers$: Observable<Transaction[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.incomes$ = this.store.select(
      IncomeState.selectTransactionsForMonth(this.date)
    );
    this.expenses$ = this.store.select(
      ExpenseState.selectPaidTransactionsForMonth(this.date)
    );
    this.transfers$ = this.store.select(
      TransferState.selectTransactionsForMonth(this.date)
    );

    this.expenses$.subscribe((expenses: Transaction[]) => {
      this.incomes$.subscribe((incomes: Transaction[]) => {
        this.transfers$.subscribe((transfers: Transaction[]) => {
          let transactions = transfers
                  .concat(incomes)
                  .concat(expenses)
                  .sort(compareTransactions);
          
          this.data = [];
          for (let index = 0; index < 5; index++) {
            const transaction = transactions[index];
            if(transaction){
              this.data.push(transaction);
            }
          }
        });
      });
    });
  }

  getIcon(type: TransactionTypes) {
    switch (type) {
      case TransactionTypes.Expense:
      case TransactionTypes.MonthlyExpense:
        return 'angle-double-down';
      case TransactionTypes.Income:
      case TransactionTypes.MonthlyIncome:
        return 'angle-double-up';
      case TransactionTypes.Transfer:
        return 'exchange-alt';
    }
  }

  getClass(type: TransactionTypes) {
    switch (type) {
      case TransactionTypes.Expense:
      case TransactionTypes.MonthlyExpense:
        return 'expense';
      case TransactionTypes.Income:
      case TransactionTypes.MonthlyIncome:
        return 'income';
      case TransactionTypes.Transfer:
        return 'transfer';
    }
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