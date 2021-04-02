import { Component, OnInit, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category, CategoryTypes } from 'src/app/category';
import { CategoryState } from 'src/app/state';

@Component({
  selector: 'expense-categories',
  templateUrl: './expense-categories.component.html',
  styleUrls: ['./expense-categories.component.scss'],
})
export class ExpenseCategoriesComponent implements OnInit {
  
  @Select(CategoryState.selectExpenseCategories) data$: Observable<Category[]>;
  categoryType: CategoryTypes = CategoryTypes.Expense;
  constructor() {}

  ngOnInit(): void {}

  
}
