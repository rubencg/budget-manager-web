import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction, TransactionTypes } from 'src/app/models';

@Component({
  selector: 'transaction-mobile',
  templateUrl: './transaction.mobile.component.html',
  styleUrls: ['./transaction.mobile.component.scss']
})
export class TransactionMobileComponent implements OnInit {
  @Input() transaction: Transaction;
  @Output() onDelete: EventEmitter<Transaction> = new EventEmitter();
  @Output() onEdit: EventEmitter<Transaction> = new EventEmitter();
  @Output() onApply: EventEmitter<Transaction> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  editTransaction(transaction: Transaction){
    this.onEdit.emit(transaction);
  }

  deleteTransaction(transaction: Transaction){
    this.onDelete.emit(transaction);
  }

  applyTransaction(transaction: Transaction){
    this.onApply.emit(transaction);
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

}
