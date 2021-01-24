import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
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

  constructor(public incomeService: IncomeService){
    this.items$ = incomeService.getAllIncomes();
    
  }
}
