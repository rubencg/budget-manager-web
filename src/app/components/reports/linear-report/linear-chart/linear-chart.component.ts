import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { LineElement } from 'src/app/models';

@Component({
  selector: 'linear-chart',
  templateUrl: './linear-chart.component.html',
  styleUrls: ['./linear-chart.component.scss'],
})
export class LinearChartComponent implements OnInit {
  @Input() data: LineElement[] = [];
  @Input() color: string;
  @Input() currentDate: Date; // 0 based months
  

  constructor() {}

  ngOnInit(): void {
    this.fillChart(this.currentDate, this.data);
  }

  clearChart(){
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.lineChartColors[0].backgroundColor = [];
  }

  public fillChart(date: Date, data: LineElement[]){
    this.clearChart();

    // Fill
    let currentMonth = date.getMonth();
    let lastDayOfMonth = new Date(date.getFullYear(), currentMonth + 1, 0);
    let colors = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      let lineElement = data.find(
        (l) =>
          l.date.getDate() == day &&
          l.date.getMonth() == currentMonth
      );

      if (lineElement) {
        this.lineChartData.push(lineElement.amount);
      } else {
        this.lineChartData.push(0);
      }

      this.lineChartLabels.push(day.toString() + '/' + (currentMonth + 1));
      colors.push(this.color);
    }
    this.lineChartColors[0].backgroundColor = colors;
  }

  // Doughnut
  public lineChartLabels: Label[] = [];
  public lineChartData = [];
  public lineChartType: ChartType = 'line';
  public options: ChartOptions = {
    legend: {
      display: false,
    },
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: [],
    },
  ];
}
