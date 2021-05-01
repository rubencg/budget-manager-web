import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Expense, MonthlyExpense } from 'src/app/expense';
import { PieElement } from 'src/app/models';
import * as _ from 'lodash';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { ExpenseStateModel } from 'src/app/state';

@Component({
  selector: 'fixed-variable-expenses',
  templateUrl: './fixed-variable-expenses.component.html',
  styleUrls: ['./fixed-variable-expenses.component.scss']
})
export class FixedVariableExpensesComponent implements OnInit, AfterViewInit {

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
    this.expenses$ = this.store.select((state) => state.expenseState).pipe(
      delay(0),
      map((expenseState: ExpenseStateModel) => {
        
        // group expenses by category
        const fixedExpenses: MonthlyExpense[] = expenseState.monthlyExpenses;
        const variableExpenses: Expense[] = expenseState.expenses.filter(
          (t: Expense) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
        );
        const fixedExpensesAmount = fixedExpenses.reduce((a, b: Expense) => +a + b.amount, 0);
        const variableExpensesAmount = variableExpenses.reduce((a, b: Expense) => +a + b.amount, 0);
        const total = variableExpensesAmount + fixedExpensesAmount;
        
        const pieElements: PieElement[] = [
          {
            description: 'Gastos Fijos',
            amount: fixedExpensesAmount,
            color: '#a83632',
            icon: 'align-justify',
            percentage: +(fixedExpensesAmount / total * 100)
          },
          {
            description: 'Gastos Variables',
            amount: variableExpensesAmount,
            color: '#3289a8',
            icon: 'align-center',
            percentage: +(variableExpensesAmount / total * 100)
          },
        ];
        
        // const pieElements: PieElement[] = _.map(expensesByCategory, function(value: Expense[], key) {
        //   const categoryAmount = value.reduce((a, b: Expense) => +a + b.amount, 0);
        //   const pieElement: PieElement = { 
        //     description: key, 
        //     amount: categoryAmount,
        //     color: value[0].category.color,
        //     icon: value[0].category.image,
        //     percentage: +(categoryAmount / totalAmount * 100)
        //   };
        //   return pieElement;
        // });
        
        return pieElements.sort((a, b) => b.amount - a.amount );
      })
    );

    this.pieChart.setData(this.expenses$);
  }

}
