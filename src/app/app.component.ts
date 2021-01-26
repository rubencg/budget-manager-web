import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Account } from './account';
import { AccountState, AccountActions, IncomeState, IncomeActions } from './state';
import { Income } from './income';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor='let item of items$ | async'>
        {{item.amount}}
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'budget-manager-web';
  @Select(IncomeState.selectIncomes) items$: Observable<Income[]>;

  constructor(private store: Store){
    this.store.dispatch(new IncomeActions.Get());
    this.store.dispatch(new AccountActions.Get());
    
  }
}
