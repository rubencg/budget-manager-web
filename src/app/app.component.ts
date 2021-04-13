import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import * as Chart from 'chart.js';
import { AccountActions, CategoryActions, ExpenseActions, IncomeActions, TransferActions, MonthlyIncomeActions } from './state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    'app.component.styles.scss'
  ]
})
export class AppComponent {
  title = 'budget-manager-web';
  
  constructor(private store: Store){
    Chart.defaults.global.defaultFontColor = '#828bc2';
    Chart.defaults.global.defaultFontFamily = 'Maven Pro';

    this.store.dispatch(AccountActions.Get);
    this.store.dispatch(AccountActions.GetTypes);
    this.store.dispatch(AccountActions.GetArchivedAccounts);
    this.store.dispatch(CategoryActions.GetExpenseCategories);
    this.store.dispatch(CategoryActions.GetIncomeCategories);
    this.store.dispatch(TransferActions.Get);
    this.store.dispatch(IncomeActions.Get);
    this.store.dispatch(ExpenseActions.Get);
    this.store.dispatch(MonthlyIncomeActions.Get);
    
  }


}
