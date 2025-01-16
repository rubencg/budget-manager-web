import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Select, Store } from '@ngxs/store';
import * as Chart from 'chart.js';
import { Observable } from 'rxjs';
import { User } from './models/user';
import {
  AccountActions,
  CategoryActions,
  ExpenseActions,
  IncomeActions,
  TransferActions,
  MonthlyIncomeActions,
  MonthlyExpenseActions,
  DashboardAccountActions,
} from './state';
import { AuthenticationState } from './state/authentication/authentication.state';
import { PlannedExpenseActions } from './state/expense/planned-expense.actions';
import { SavingActions } from './state/expense/saving-actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.styles.scss'],
})
export class AppComponent implements OnInit {
  title = 'budget-manager-web';
  isAuthenticated = this.store.selectSnapshot(
    AuthenticationState.isAuthenticated
  );
  @Select(AuthenticationState.user) user$: Observable<User>;

  constructor(private store: Store, public afAuth: AngularFireAuth) {
    Chart.defaults.global.defaultFontColor = '#828bc2';
    Chart.defaults.global.defaultFontFamily = 'Maven Pro';
  }

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.afAuth.onAuthStateChanged(user => {
        if(user){          
          this.store.dispatch(AccountActions.Get);
          this.store.dispatch(DashboardAccountActions.Get);
          this.store.dispatch(AccountActions.GetTypes);
          this.store.dispatch(AccountActions.GetArchivedAccounts);
          this.store.dispatch(CategoryActions.GetExpenseCategories);
          this.store.dispatch(CategoryActions.GetIncomeCategories);
          this.store.dispatch(TransferActions.Get);
          this.store.dispatch(IncomeActions.Get);
          this.store.dispatch(ExpenseActions.Get);
          this.store.dispatch(MonthlyIncomeActions.Get);
          this.store.dispatch(MonthlyExpenseActions.Get);
          this.store.dispatch(PlannedExpenseActions.Get);
          this.store.dispatch(SavingActions.Get);
        }
      }) 
    }
  }
}
