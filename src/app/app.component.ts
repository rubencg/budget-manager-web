import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from './account/account.service';
import { ExpenseService } from './expense/expense.service';
import { IncomeCategoryService } from './category/income-category.service';
import { IncomeService } from './income/income.service';
import { ExpenseCategoryService } from './category/expense-category.service';
import { TransferService } from './transfer/transfer.service';

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

  constructor(public service: TransferService){
    this.items$ = service.getAll();
    
  }
}
