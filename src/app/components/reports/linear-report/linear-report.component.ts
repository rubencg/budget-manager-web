import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExpensesByMonthComponent } from './expenses-by-month/expenses-by-month.component';

@Component({
  selector: 'linear-report',
  templateUrl: './linear-report.component.html',
  styleUrls: ['./linear-report.component.scss']
})
export class LinearReportComponent implements OnInit {
  @ViewChild(ExpensesByMonthComponent) expensesByMonth: ExpensesByMonthComponent;

  constructor() { }

  ngOnInit(): void {
    

  }

  changeDate(date: Date){
    if(this.expensesByMonth){
      this.expensesByMonth.changeDate(date);
    }
  }

}
