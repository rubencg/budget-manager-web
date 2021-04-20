import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import { LineElement } from 'src/app/models';
import { LinearChartTypes } from '../linear-chart-types';

@Component({
  selector: 'linear-chart',
  templateUrl: './linear-chart.component.html',
  styleUrls: ['./linear-chart.component.scss'],
})
export class LinearChartComponent implements OnInit {
  @Input() color: string;
  @Input() linearChartType: LinearChartTypes;  

  constructor() {}

  ngOnInit(): void {
    
  }

  clearChart(){
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.lineChartColors[0].backgroundColor = [];
  }

  public setData(date: Date, data: Observable<LineElement[]>){
    data.subscribe((elements: LineElement[]) => {
      this.clearChart();

      // Fill
      switch (this.linearChartType) {
        case LinearChartTypes.Month:
          this.fillByMonth(date, elements);
          break;
        case LinearChartTypes.Year:
          this.fillByYear(date, elements);
          break;
      }
    });
    
  }

  fillByYear(date: Date, data: LineElement[]){
    let currentYear = date.getFullYear();
    let colors = [];
    for (let month = 0; month < 12; month++) {
      let lineElement = data.find(
        (l) =>
          l.date.getFullYear() == currentYear &&
          l.date.getMonth() == month
      );

      if (lineElement) {
        this.lineChartData.push(lineElement.amount);
      } else {
        this.lineChartData.push(0);
      }

      this.lineChartLabels.push((month + 1) + '/' + (currentYear));
      colors.push(this.color);
    }
    this.lineChartColors[0].backgroundColor = colors;
  }

  fillByMonth(date: Date, data: LineElement[]){
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
