import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AccountActions, IncomeState, IncomeActions, ExpenseActions, ExpenseState, AccountState, CategoryActions } from './state';
import { Income } from './income';
import { Expense } from './expense';
import { Account } from './account';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor='let item of items$ | async'>
        {{item.description}}
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'budget-manager-web';
  @Select(AccountState.selectAccounts) items$: Observable<Account[]>;

  constructor(private store: Store){
    this.store.dispatch(new IncomeActions.Get());
    this.store.dispatch(new AccountActions.Get());
    this.store.dispatch(new ExpenseActions.Get());
    this.store.dispatch(new CategoryActions.GetIncomeCategories());
    
  }
}
