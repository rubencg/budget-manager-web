import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category, CategoryTypes } from 'src/app/category';
import { CategoryState } from 'src/app/state';

@Component({
  selector: 'income-categories',
  templateUrl: './income-categories.component.html',
  styleUrls: ['./income-categories.component.scss']
})
export class IncomeCategoriesComponent implements OnInit {
  @Select(CategoryState.selectIncomeCategories) data$: Observable<Category[]>;
  categoryType: CategoryTypes = CategoryTypes.Income;

  constructor() { }

  ngOnInit(): void {
  }

}
