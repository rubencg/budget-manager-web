import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from './account/account.service';
import { ExpenseService } from './expense/expense.service';
import { IncomeService } from './income/income.service';

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
  items$!: Observable<any[]>;

  constructor(public service: ExpenseService){
    this.items$ = service.getAll();
    
  }
}
