import { Component, Input, OnInit } from '@angular/core';
import { Transaction, TransactionTypes } from 'src/app/models';

@Component({
  selector: 'last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss'],
})
export class LastTransactionsComponent implements OnInit {
  @Input() data: Transaction[];

  constructor() {}

  ngOnInit(): void {}

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
