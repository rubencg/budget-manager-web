import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpensesByAccountComponent } from './expenses-by-account/expenses-by-account.component';
import { ExpensesByCategoryComponent } from './expenses-by-category/expenses-by-category.component';
import { IncomesByAccountComponent } from './incomes-by-account/incomes-by-account.component';
import { IncomesByCategoryComponent } from './incomes-by-category/incomes-by-category.component';

@Component({
  selector: 'pie-report',
  templateUrl: './pie-report.component.html',
  styleUrls: ['./pie-report.component.scss']
})
export class PieReportComponent implements OnInit {
  @ViewChild(ExpensesByCategoryComponent) expensesByCategory: ExpensesByCategoryComponent;
  @ViewChild(ExpensesByAccountComponent) expensesByAccount: ExpensesByAccountComponent;
  @ViewChild(IncomesByCategoryComponent) incomesByCategory: IncomesByCategoryComponent;
  @ViewChild(IncomesByAccountComponent) incomesByAccount: IncomesByAccountComponent;

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
    if(this.incomesByCategory){
      this.incomesByCategory.changeDate(date);
    }
    if(this.incomesByAccount){
      this.incomesByAccount.changeDate(date);
    }
  }

}
