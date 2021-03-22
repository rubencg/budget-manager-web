import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'income-categories',
  templateUrl: './income-categories.component.html',
  styleUrls: ['./income-categories.component.scss']
})
export class IncomeCategoriesComponent implements OnInit {
  data = [
    {
      image: 'briefcase',
      color: '#32a852',
      name: 'Salario',
      subcategories: ['Blusas', 'Amazon'],
    },
    {
      image: 'hand-holding-usd',
      color: '#c4412f',
      name: 'Bono',
      subcategories: ['Blusas', 'Amazon'],
    },
    {
      name: 'Otros',
      image: 'money-check',
      color: '#32a852',
      subcategories: ['Cine', 'Hobbies'],
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
