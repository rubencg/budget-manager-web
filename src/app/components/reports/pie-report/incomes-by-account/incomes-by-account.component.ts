import { Component, OnInit } from '@angular/core';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'incomes-by-account',
  templateUrl: './incomes-by-account.component.html',
  styleUrls: ['./incomes-by-account.component.scss']
})
export class IncomesByAccountComponent implements OnInit {

  data: PieElement[] = [
    {
      description: 'Ruben Efectivo',
      color: '#4287f5',
      amount: 3000,
      icon: 'money-bill',
      percentage: 75.09
    },{
      description: 'Sarahi Debito',
      color: '#f5e042',
      amount: 2033.33,
      icon: 'money-check-alt',
      percentage: 2.91
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
