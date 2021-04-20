import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Income } from 'src/app/income';
import { PieElement } from 'src/app/models';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import * as _ from 'lodash';

@Component({
  selector: 'incomes-by-account',
  templateUrl: './incomes-by-account.component.html',
  styleUrls: ['./incomes-by-account.component.scss']
})
export class IncomesByAccountComponent implements OnInit, AfterViewInit {

  @ViewChild(PieChartComponent) pieChart: PieChartComponent;
  incomes$: Observable<PieElement[]>;
  
  constructor(private store: Store) { 

  }  
  ngAfterViewInit(): void {
    this.changeDate(new Date());
  }

  ngOnInit(): void {
  }

  changeDate(date: Date){
    this.incomes$ = this.store.select((state) => state.incomeState.incomes).pipe(
      delay(0),
      map((incomes: Income[]) => {
        
        // group incomes by account
        const appliedincomes: Income[] = incomes.filter(
          (t: Income) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear() &&
          t.isApplied
          );
        const incomesByAccount = _.groupBy(appliedincomes, (e: Income) => e.toAccount.name);
        const totalAmount = appliedincomes.reduce((a, b: Income) => +a + b.amount, 0);
        
        const pieElements: PieElement[] = _.map(incomesByAccount, function(value: Income[], key) {
          const amount = value.reduce((a, b: Income) => +a + b.amount, 0);
          const pieElement: PieElement = { 
            description: key, 
            amount: amount,
            color: value[0].toAccount.color,
            icon: value[0].toAccount.image,
            percentage: +(amount / totalAmount * 100)
          };
          return pieElement;
        });
        
        return pieElements.sort((a, b) => b.amount - a.amount );
      })
    );

    this.pieChart.setData(this.incomes$);
  }  

}
