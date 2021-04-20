import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Expense } from 'src/app/expense';
import { LineElement } from 'src/app/models';
import { LinearChartTypes } from '../linear-chart-types';
import { LinearChartComponent } from '../linear-chart/linear-chart.component';
import * as _ from 'lodash';

@Component({
  selector: 'expenses-by-month',
  templateUrl: './expenses-by-month.component.html',
  styleUrls: ['./expenses-by-month.component.scss']
})
export class ExpensesByMonthComponent implements OnInit, AfterViewInit {
  linearChartType: LinearChartTypes = LinearChartTypes.Month;
  color: string = 'rgba(235, 100, 52, 0.4)'; // Red
  @ViewChild(LinearChartComponent) linearChart: LinearChartComponent;
  expenses$: Observable<LineElement[]>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.changeDate(new Date());
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
        const expensesByDayOfTheMonth = _.groupBy(appliedExpenses, (e: Expense) => e.date.getDate());
        
        const lineElements: LineElement[] = _.map(expensesByDayOfTheMonth, function(value: Expense[], key) {
          const categoryAmount = value.reduce((a, b: Expense) => +a + b.amount, 0);
          const lineElement: LineElement = { 
            amount: categoryAmount,
            date: new Date(date.getFullYear(), date.getMonth(), key)            
          };
          return lineElement;
        });
        
        return lineElements.sort((a, b) => b.amount - a.amount );
      })
    );

    this.linearChart.setData(date, this.expenses$);
  }

}
