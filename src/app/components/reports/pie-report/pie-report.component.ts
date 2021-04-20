import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpensesByCategoryComponent } from './expenses-by-category/expenses-by-category.component';

@Component({
  selector: 'pie-report',
  templateUrl: './pie-report.component.html',
  styleUrls: ['./pie-report.component.scss']
})
export class PieReportComponent implements OnInit {
  @ViewChild(ExpensesByCategoryComponent) expensesByCategory: ExpensesByCategoryComponent;

  constructor() { }

  ngOnInit(): void {
  }

  changeDate(date: Date){    
    this.expensesByCategory.changeDate(date);
  }

}
