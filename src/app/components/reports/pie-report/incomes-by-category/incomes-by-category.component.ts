import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Income } from 'src/app/income';
import { PieElement } from 'src/app/models';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import * as _ from 'lodash';

@Component({
  selector: 'incomes-by-category',
  templateUrl: './incomes-by-category.component.html',
  styleUrls: ['./incomes-by-category.component.scss']
})
export class IncomesByCategoryComponent implements OnInit {

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
        
        // group incomes by category
        const appliedincomes: Income[] = incomes.filter(
          (t: Income) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear() &&
          t.isApplied
          );
        const incomesByCategory = _.groupBy(appliedincomes, (e: Income) => e.category.name);
        const totalAmount = appliedincomes.reduce((a, b: Income) => +a + b.amount, 0);
        
        const pieElements: PieElement[] = _.map(incomesByCategory, function(value: Income[], key) {
          const categoryAmount = value.reduce((a, b: Income) => +a + b.amount, 0);
          const pieElement: PieElement = { 
            description: key, 
            amount: categoryAmount,
            color: value[0].category.color,
            icon: value[0].category.image,
            percentage: +(categoryAmount / totalAmount * 100)
          };
          return pieElement;
        });
        
        return pieElements.sort((a, b) => b.amount - a.amount );
      })
    );

    this.pieChart.setData(this.incomes$);
  }

}
