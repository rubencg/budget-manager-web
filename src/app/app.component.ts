import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Account } from './account';
import { AccountSelectors, AccountActions } from './state';

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
  @Select(AccountSelectors.selectAccounts) items$: Observable<Account[]>;

  constructor(private store: Store){
    this.store.dispatch(new AccountActions.Get());
    
  }
}
