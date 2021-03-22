import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryTypes } from 'src/app/category';

@Component({
  selector: 'app-categories-content',
  templateUrl: './categories-content.component.html',
  styleUrls: ['./categories-content.component.scss'],
})
export class CategoriesContentComponent implements OnInit {
  expenseCategoriesSelected = true;
  @Output()
  tabChanged: EventEmitter<CategoryTypes> = new EventEmitter<CategoryTypes>();

  constructor() {}

  ngOnInit(): void {}

  changeLabel($event) {
    this.expenseCategoriesSelected = !this.expenseCategoriesSelected;

    let categoryType: CategoryTypes = this.expenseCategoriesSelected
      ? CategoryTypes.Expense
      : CategoryTypes.Income;

    this.tabChanged.emit(categoryType);
  }
}
