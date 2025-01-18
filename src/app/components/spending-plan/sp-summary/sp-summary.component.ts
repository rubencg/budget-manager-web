import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Transaction } from 'src/app/models';
import { Saving } from 'src/app/saving';
import { compareTransactionsByDate } from 'src/app/utils';

@Component({
  selector: 'app-sp-summary',
  templateUrl: './sp-summary.component.html',
  styleUrls: ['./sp-summary.component.scss'],
})
export class SpSummaryComponent implements AfterViewInit, OnChanges {
  @Input() incomeTransactions: Transaction[];
  incomeTransactionsSource = new MatTableDataSource<Transaction>();
  @Input() incomesSum: number;
  @Input() expenseTransactions: Transaction[];
  expenseTransactionsSource = new MatTableDataSource<Transaction>();
  @Input() expensesSum: number;
  @Input() savings: Saving[];
  @Input() savingSum: number;

  displayedColumns: string[];

  constructor(private deviceService: DeviceDetectorService) {
    this.displayedColumns = this.deviceService.isMobile()
      ? ['transaction-content']
      : [
          'date',
          'category',
          'account',
          'amount-applied',
          'notes',
          'applied',
          'actions',
        ];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['incomeTransactions'] &&
      changes['incomeTransactions'].currentValue
    ) {
      this.incomeTransactions = changes['incomeTransactions'].currentValue;
      this.setIncomeSource();
    }
    if (
      changes['expenseTransactions'] &&
      changes['expenseTransactions'].currentValue
    ) {
      this.expenseTransactions = changes['expenseTransactions'].currentValue;
      this.setExpenseSource();
    }
  }

  ngAfterViewInit(): void {
    this.setIncomeSource();
    this.setExpenseSource();
  }

  setIncomeSource() {
    if (this.incomeTransactions){
      this.incomeTransactionsSource = new MatTableDataSource<Transaction>(
        this.incomeTransactions.sort(compareTransactionsByDate)
      );
    }
  }

  setExpenseSource() {
    if (this.expenseTransactions){
      this.expenseTransactionsSource = new MatTableDataSource<Transaction>(
        this.expenseTransactions.sort(compareTransactionsByDate)
      );
    }
  }
}
