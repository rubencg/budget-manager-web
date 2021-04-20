import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Color } from 'ng2-charts';
import { Observable } from 'rxjs';
import { TopExpense, Transaction } from 'src/app/models';
import { ExpenseState } from 'src/app/state';

@Component({
  selector: 'top-expenses',
  templateUrl: './top-expenses.component.html',
  styleUrls: ['./top-expenses.component.scss'],
})
export class TopExpensesComponent implements OnInit {
  topExpenses$: Observable<TopExpense[]>;
  data: TopExpense[];
  constructor(private store: Store) {}

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public barChartLabels = [];
  public barChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartData = [
    {
      data: [],
    },
  ];
  public barChartColors: Color[] = [
    {
      backgroundColor: [
        'rgba(138, 22, 255, 0.7)',
        'rgba(255, 37, 194, 0.7)',
        'rgba(36, 223, 254, 0.7)',
      ],
    },
  ];

  ngOnInit(): void {
    this.setData(new Date());
  }

  public setData(date: Date){
    this.topExpenses$ = this.store.select(
      ExpenseState.getExpensesGrouppedByCategoryForMonth(date)
    );
    this.topExpenses$.subscribe((topExpenses: TopExpense[]) => {
      this.data = [];
      this.barChartLabels = [];
      this.barChartData = [
        {
          data: [],
        },
      ];

      this.data = topExpenses.sort((a, b) => b.amount - a.amount);
      for (let index = 0; index < 3; index++) {
        const element = this.data[index];
        if(element){
          this.barChartLabels.push(element.name);
          this.barChartData[0].data.push(element.amount); 
        }
      };
    });
  }
}
