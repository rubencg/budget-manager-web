import { Component, OnInit } from '@angular/core';
import { MonthlyBudget, TopExpense, Transaction, TransactionTypes } from 'src/app/models';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
      type: TransactionTypes.Expense,
      title: 'Uber',
      amount: 50.45,
      date: new Date(2020, 0, 5),
    },
    {
      type: TransactionTypes.Transfer,
      title: 'Ruben Credito a Ruben Debito',
      amount: 1345,
      date: new Date(2020, 0, 4),
    },
    {
      type: TransactionTypes.Income,
      title: 'Salario',
      amount: 1000,
      date: new Date(2020, 0, 2),
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
