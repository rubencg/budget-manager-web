import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AccountActions } from './state/budget-manager.actions';
import { Account } from './account/account';
import { BudgetManagerState } from './state/budget-manager.state';

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
  @Select(BudgetManagerState.selectAccounts) items$: Observable<Account[]>;

  constructor(private store: Store){
    this.store.dispatch(new AccountActions.Get());
    
  }
}
