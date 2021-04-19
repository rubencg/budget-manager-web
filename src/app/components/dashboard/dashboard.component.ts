import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Account } from 'src/app/account';
import {
  MonthlyBudget,
  TopExpense,
  Transaction,
  TransactionTypes,
} from 'src/app/models';
import { AccountState, ExpenseState, IncomeState } from 'src/app/state';
import { MonthlyBudgetComponent } from './monthly-budget/monthly-budget.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  
  topExpenses: TopExpense[] = [
    { name: 'Servicios', amount: 11235.78 },
    { name: 'Casa', amount: 5300 },
    { name: 'Despensa', amount: 7630.34 },
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

  constructor(private store: Store) {}

  /* Monthly Budget */
  incomes: Transaction[];
  monthlyIncomes: Transaction[];
  paidExpenses: Transaction[];
  unPaidExpenses: Transaction[];
  monthlyExpenses: Transaction[];
  accounts: Account[];

  ngOnInit(): void {
    
  }

}
