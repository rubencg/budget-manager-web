import { Component, OnInit } from '@angular/core';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'expenses-by-category',
  templateUrl: './expenses-by-category.component.html',
  styleUrls: ['./expenses-by-category.component.scss']
})
export class ExpensesByCategoryComponent implements OnInit {
  data: PieElement[] = [
    {
      description: 'Ropa',
      color: '#32a852',
      amount: 333.33,
      icon: 'tshirt',
      percentage: 97.09
    },{
      description: 'Casa',
      color: '#f5e042',
      amount: 133.33,
      icon: 'home',
      percentage: 2.91
    },{
      description: 'Restaurantes',
      color: '#a84832',
      amount: 33.33,
      icon: 'glass-martini-alt',
      percentage: 1.91
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
