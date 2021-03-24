import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryTypes } from 'src/app/category';

@Component({
  selector: 'app-categories-content',
  templateUrl: './categories-content.component.html',
  styleUrls: ['./categories-content.component.scss'],
})
export class CategoriesContentComponent implements OnInit {
  expenseCategoriesSelected = true;
  categoryType: CategoryTypes = CategoryTypes.Expense;

  constructor() {}

  ngOnInit(): void {}

  changeLabel($event) {
    this.expenseCategoriesSelected = !this.expenseCategoriesSelected;

    this.categoryType = this.expenseCategoriesSelected
      ? CategoryTypes.Expense
      : CategoryTypes.Income;
  }
}
