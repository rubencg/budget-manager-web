import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpensesByAccountComponent } from './expenses-by-account/expenses-by-account.component';
import { ExpensesByCategoryComponent } from './expenses-by-category/expenses-by-category.component';

@Component({
  selector: 'pie-report',
  templateUrl: './pie-report.component.html',
  styleUrls: ['./pie-report.component.scss']
})
export class PieReportComponent implements OnInit {
  @ViewChild(ExpensesByCategoryComponent) expensesByCategory: ExpensesByCategoryComponent;
  @ViewChild(ExpensesByAccountComponent) expensesByAccount: ExpensesByAccountComponent;

  constructor() { }

  ngOnInit(): void {
  }

  changeDate(date: Date){    
    if(this.expensesByCategory){
      this.expensesByCategory.changeDate(date);
    }
    if(this.expensesByAccount){
      this.expensesByAccount.changeDate(date);
    }
  }

}
