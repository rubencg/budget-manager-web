import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LineElement } from 'src/app/models';
import { LinearChartComponent } from '../linear-chart/linear-chart.component';
import { LinearReportComponent } from '../linear-report.component';

@Component({
  selector: 'expenses-by-month',
  templateUrl: './expenses-by-month.component.html',
  styleUrls: ['./expenses-by-month.component.scss']
})
export class ExpensesByMonthComponent implements OnInit {
  @Input() currentDate: Date;
  data: LineElement[] = [];
  color: string = 'rgba(235, 100, 52, 0.4)'; // Red
  @ViewChild(LinearChartComponent) linearChart: LinearChartComponent;

  constructor() { }

  ngOnInit(): void {
    this.data = [
      {
        amount: Math.random() * 3550,
        date: new Date(2021, this.currentDate.getMonth(), Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, this.currentDate.getMonth(), Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, this.currentDate.getMonth(), Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, this.currentDate.getMonth(), Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, this.currentDate.getMonth(), Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, this.currentDate.getMonth(), Math.random() * 28),
      },
    ];
  }

}
