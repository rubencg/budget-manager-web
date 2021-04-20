import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Expense } from 'src/app/expense';
import { PieElement } from 'src/app/models';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import * as _ from 'lodash';

@Component({
  selector: 'expenses-by-account',
  templateUrl: './expenses-by-account.component.html',
  styleUrls: ['./expenses-by-account.component.scss']
})
export class ExpensesByAccountComponent implements OnInit, AfterViewInit {

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
        
        // group expenses by account
        const appliedExpenses: Expense[] = expenses.filter(
          (t: Expense) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear() &&
          t.isApplied
          );
        const expensesByAccount = _.groupBy(appliedExpenses, (e: Expense) => e.fromAccount.name);
        const totalAmount = appliedExpenses.reduce((a, b: Expense) => +a + b.amount, 0);
        
        const pieElements: PieElement[] = _.map(expensesByAccount, function(value: Expense[], key) {
          const amount = value.reduce((a, b: Expense) => +a + b.amount, 0);
          const pieElement: PieElement = { 
            description: key, 
            amount: amount,
            color: value[0].fromAccount.color,
            icon: value[0].fromAccount.image,
            percentage: +(amount / totalAmount * 100)
          };
          return pieElement;
        });
        
        return pieElements.sort((a, b) => b.amount - a.amount );
      })
    );

    this.pieChart.setData(this.expenses$);
  }

}
