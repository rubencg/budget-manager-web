import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Transaction } from 'src/app/models';

@Component({
  selector: 'app-other-expenses',
  templateUrl: './other-expenses.component.html',
  styleUrls: ['./other-expenses.component.scss'],
})
export class OtherExpensesComponent implements AfterViewInit, OnChanges {
  @Input() expenses: Transaction[];
  expensesSource = new MatTableDataSource<Transaction>();
  displayedColumns: string[];

  constructor(private deviceService: DeviceDetectorService) {
    this.displayedColumns = this.deviceService.isMobile()
      ? ['transaction-content']
      : [
          'date',
          'category',
          'account',
          'amount',
          'notes',
          'actions',
        ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] && changes['expenses'].currentValue) {
      this.expenses = changes['expenses'].currentValue;
      this.setExpenseSource();
    }
  }

  ngAfterViewInit(): void {
    this.setExpenseSource();
  }

  setExpenseSource() {
    this.expensesSource = new MatTableDataSource<Transaction>(this.expenses);
  }
}
