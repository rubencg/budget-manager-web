import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Transaction } from 'src/app/models';

@Component({
  selector: 'app-sp-summary',
  templateUrl: './sp-summary.component.html',
  styleUrls: ['./sp-summary.component.scss'],
})
export class SpSummaryComponent implements OnInit {
  @Input() incomeTransactions = new MatTableDataSource<Transaction>();
  @Input() incomesSum: number;
  @Input() expenseTransactions = new MatTableDataSource<Transaction>();
  @Input() expensesSum: number;

  displayedColumns: string[];

  constructor(
    public store: Store,
    private deviceService: DeviceDetectorService
  ) {
    this.displayedColumns = this.deviceService.isMobile()
      ? ['transaction-content']
      : [
          'date',
          'category',
          'account',
          'amount',
          'notes',
          'applied',
          'actions',
        ];
  }

  ngOnInit(): void {}
}
