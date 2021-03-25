import { Component, OnInit } from '@angular/core';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'expenses-by-account',
  templateUrl: './expenses-by-account.component.html',
  styleUrls: ['./expenses-by-account.component.scss']
})
export class ExpensesByAccountComponent implements OnInit {

  data: PieElement[] = [
    {
      description: 'Ruben Efectivo',
      color: '#4287f5',
      amount: 3500,
      icon: 'money-bill',
      percentage: 75.09
    },{
      description: 'Sarahi Debito',
      color: '#f5e042',
      amount: 1033.33,
      icon: 'money-check-alt',
      percentage: 2.91
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
