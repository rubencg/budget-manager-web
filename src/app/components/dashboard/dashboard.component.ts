import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { LastTransactionsComponent } from './last-transactions/last-transactions.component';
import { MonthlyBudgetComponent } from './monthly-budget/monthly-budget.component';
import { TopExpensesComponent } from './top-expenses/top-expenses.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(LastTransactionsComponent) lastTransactions: LastTransactionsComponent;
  @ViewChild(TopExpensesComponent) topExpenses: TopExpensesComponent;
  @ViewChild(MonthlyBudgetComponent) monthlyBudget: MonthlyBudgetComponent;
  

  constructor(private store: Store) {}

  ngOnInit(): void {
    
  }

  onDateChanged(date: Date){
    this.lastTransactions.setData(date);
    this.topExpenses.setData(date);
    this.monthlyBudget.setData(date);
  }

}
