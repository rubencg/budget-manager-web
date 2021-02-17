import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import * as Chart from 'chart.js';
import { MonthlyBudget, TopExpense, Transaction } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    'app.component.styles.scss'
  ]
})
export class AppComponent {
  title = 'budget-manager-web';
  monthlyBudgetData: MonthlyBudget = {
    budgetExpensesAmount: 25000,
    expensesAmount: 24356.93,
    incomesAmount: 52345.34,
    currentBalance: 28234.34
  }
  topExpenses: TopExpense[] = [
    {name: 'Servicios', amount: 11235.78},
    {name: 'Casa', amount: 5300},
    {name: 'Despensa', amount: 7630.34},
  ];
  transactions: Transaction[] = [
    {
      type: 'expense',
      title: 'Uber',
      amount: 50.45,
      date: new Date(2020, 0, 5),
    },
    {
      type: 'transfer',
      title: 'Ruben Credito a Ruben Debito',
      amount: 1345,
      date: new Date(2020, 0, 4),
    },
    {
      type: 'income',
      title: 'Salario',
      amount: 1000,
      date: new Date(2020, 0, 2),
    },
  ];
  
  constructor(private store: Store){
    Chart.defaults.global.defaultFontColor = '#828bc2';
    Chart.defaults.global.defaultFontFamily = 'Maven Pro';
  }
}
