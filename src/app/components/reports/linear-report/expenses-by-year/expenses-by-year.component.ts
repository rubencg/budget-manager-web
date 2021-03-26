import { Component, Input, OnInit } from '@angular/core';
import { LineElement } from 'src/app/models';
import { LinearChartTypes } from '../linear-chart-types';

@Component({
  selector: 'expenses-by-year',
  templateUrl: './expenses-by-year.component.html',
  styleUrls: ['./expenses-by-year.component.scss']
})
export class ExpensesByYearComponent implements OnInit {
  @Input() currentDate: Date;
  linearChartType: LinearChartTypes = LinearChartTypes.Year;
  data: LineElement[] = [];
  color: string = 'rgba(235, 195, 52, 0.4)'; // Red
  

  constructor() { 
    this.data = [
      {
        amount: Math.random() * 3550,
        date: new Date(2021, 1, Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, 3, Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, 5, Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, 8, Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, 9, Math.random() * 28),
      },
      {
        amount: Math.random() * 3550,
        date: new Date(2021, 11, Math.random() * 28),
      },
    ];
  }

  ngOnInit(): void {
  }

}
