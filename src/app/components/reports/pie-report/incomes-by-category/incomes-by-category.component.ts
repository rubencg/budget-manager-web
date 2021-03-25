import { Component, OnInit } from '@angular/core';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'incomes-by-category',
  templateUrl: './incomes-by-category.component.html',
  styleUrls: ['./incomes-by-category.component.scss']
})
export class IncomesByCategoryComponent implements OnInit {

  data: PieElement[] = [
    {
      description: 'Salario',
      color: '#32a852',
      amount: 333.33,
      icon: 'tshirt',
      percentage: 97.09
    },{
      description: 'Bonos',
      color: '#f5e042',
      amount: 133.33,
      icon: 'home',
      percentage: 2.91
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
