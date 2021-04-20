import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LineElement } from 'src/app/models';
import { LinearChartTypes } from '../linear-chart-types';
import * as _ from 'lodash';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Expense } from 'src/app/expense';
import { LinearChartComponent } from '../linear-chart/linear-chart.component';

@Component({
  selector: 'expenses-by-year',
  templateUrl: './expenses-by-year.component.html',
  styleUrls: ['./expenses-by-year.component.scss']
})
export class ExpensesByYearComponent implements OnInit, AfterViewInit {
  linearChartType: LinearChartTypes = LinearChartTypes.Year;
  color: string = 'rgba(235, 195, 52, 0.4)'; // Red
  expenses$: Observable<LineElement[]>;
  @ViewChild(LinearChartComponent) linearChart: LinearChartComponent;

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
          t.date.getFullYear() == date.getFullYear() &&
          t.isApplied
          );
        const expensesByDayOfTheMonth = _.groupBy(appliedExpenses, (e: Expense) => e.date.getMonth());
        
        const lineElements: LineElement[] = _.map(expensesByDayOfTheMonth, function(value: Expense[], key) {
          const categoryAmount = value.reduce((a, b: Expense) => +a + b.amount, 0);
          const lineElement: LineElement = { 
            amount: categoryAmount,
            date: new Date(date.getFullYear(), key, 1)
          };
          return lineElement;
        });
        
        return lineElements.sort((a, b) => b.amount - a.amount );
      })
    );

    this.linearChart.setData(date, this.expenses$);
  }

}
