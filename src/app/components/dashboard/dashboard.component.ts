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
  
  constructor(private store: Store) {}

  ngOnInit(): void {
    
  }

}
