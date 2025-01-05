import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Transaction } from 'src/app/models';

@Component({
  selector: 'app-sp-summary',
  templateUrl: './sp-summary.component.html',
  styleUrls: ['./sp-summary.component.scss'],
})
export class SpSummaryComponent implements OnInit {
  @Input() incomeTransactions: Transaction[];
  @Input() incomesSum: number;
  @Input() expenseTransactions: Transaction[];
  @Input() expensesSum: number;

  displayedColumns: string[] = [
    'date',
    'category',
    'account',
    'amount',
    'notes',
    'applied',
    'actions',
  ];

  constructor(public store: Store) {}

  ngOnInit(): void {
    
  }

}
