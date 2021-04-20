import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExpensesByMonthComponent } from './expenses-by-month/expenses-by-month.component';
import { ExpensesByYearComponent } from './expenses-by-year/expenses-by-year.component';

@Component({
  selector: 'linear-report',
  templateUrl: './linear-report.component.html',
  styleUrls: ['./linear-report.component.scss']
})
export class LinearReportComponent implements OnInit {
  @ViewChild(ExpensesByMonthComponent) expensesByMonth: ExpensesByMonthComponent;
  @ViewChild(ExpensesByYearComponent) expensesByYear: ExpensesByYearComponent;

  constructor() { }

  ngOnInit(): void {
    

  }

  changeDate(date: Date){
    if(this.expensesByMonth){
      this.expensesByMonth.changeDate(date);
    }
    if(this.expensesByYear){
      this.expensesByYear.changeDate(date);
    }
  }

}
