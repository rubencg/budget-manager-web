import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'expense-categories',
  templateUrl: './expense-categories.component.html',
  styleUrls: ['./expense-categories.component.scss'],
})
export class ExpenseCategoriesComponent implements OnInit {
  
  data = [
    {
      name: 'Ropa',
      image: 'tshirt',
      color: '#32a852',
      subcategories: ['Blusas', 'Amazon'],
    },
    {
      name: 'Entretenimiento',
      image: 'ticket-alt',
      color: '#a84832',
      subcategories: ['Cine', 'Hobbies'],
    },
    {
      name: 'Restaurantes',
      image: 'glass-martini-alt',
      color: '#f5e042',
      subcategories: ['Comida Rapida', 'Cheat meals'],
    },
    {
      name: 'Ropa',
      image: 'tshirt',
      color: '#32a852',
      subcategories: ['Blusas', 'Amazon'],
    },
    {
      name: 'Entretenimiento',
      image: 'ticket-alt',
      color: '#a84832',
      subcategories: ['Cine', 'Hobbies'],
    },
    {
      name: 'Restaurantes',
      image: 'glass-martini-alt',
      color: '#f5e042',
      subcategories: ['Comida Rapida', 'Cheat meals'],
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  
}
