import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Expense } from 'src/app/expense';
import { PieElement } from 'src/app/models';
import * as _ from 'lodash';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@Component({
  selector: 'expenses-by-category',
  templateUrl: './expenses-by-category.component.html',
  styleUrls: ['./expenses-by-category.component.scss']
})
export class ExpensesByCategoryComponent implements OnInit, AfterViewInit {
  @ViewChild(PieChartComponent) pieChart: PieChartComponent;
  expenses$: Observable<PieElement[]>;
  
  constructor(private store: Store) { 

  }
    
  ngAfterViewInit(): void {
    this.changeDate(new Date());
  }

  ngOnInit(): void {
  }

  changeDate(date: Date){
    this.expenses$ = this.store.select((state) => state.expenseState.expenses).pipe(
      delay(0),
      map((expenses: Expense[]) => {
        
        // group expenses by category
        const appliedExpenses: Expense[] = expenses.filter(
          (t: Expense) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear() &&
          t.isApplied
          );
        const expensesByCategory = _.groupBy(appliedExpenses, (e: Expense) => e.category.name);
        const totalAmount = appliedExpenses.reduce((a, b: Expense) => +a + b.amount, 0);
        
        const pieElements: PieElement[] = _.map(expensesByCategory, function(value: Expense[], key) {
          const categoryAmount = value.reduce((a, b: Expense) => +a + b.amount, 0);
          const pieElement: PieElement = { 
            description: key, 
            amount: categoryAmount,
            color: value[0].category.color,
            icon: value[0].category.image,
            percentage: +(categoryAmount / totalAmount * 100)
          };
          return pieElement;
        });
        
        return pieElements.sort((a, b) => b.amount - a.amount );
      })
    );

    this.pieChart.setData(this.expenses$);
  }

}
