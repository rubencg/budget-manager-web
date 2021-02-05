import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';
import { TopExpensesModel } from 'src/app/models';

@Component({
  selector: 'top-expenses',
  templateUrl: './top-expenses.component.html',
  styleUrls: ['./top-expenses.component.scss'],
})
export class TopExpensesComponent implements OnInit {
  @Input() data: TopExpensesModel[];
  constructor() {}

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
    this.data = this.data.sort((a, b) => b.amount - a.amount);
    this.data.forEach(element => {
      this.barChartLabels.push(element.name);
      this.barChartData[0].data.push(element.amount);
    });
  }
}
