import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import {
  Category,
  ExpenseCategoryService,
  IncomeCategoryService,
} from '../../category/';
import { CategoryActions } from './category.actions';

export interface CategoryStateModel {
  incomeCategories: Category[];
  expenseCategories: Category[];
}

@State<CategoryStateModel>({
  name: 'categoryState',
  defaults: {
    incomeCategories: [],
    expenseCategories: [],
  },
})
@Injectable()
export class CategoryState {
  constructor(
    private incomeCategoryService: IncomeCategoryService,
    private expenseCategoryService: ExpenseCategoryService
  ) {}

  @Selector()
  static selectIncomeCategories(state: CategoryStateModel) {
    return state.incomeCategories;
  }

  @Selector()
  static selectExpenseCategories(state: CategoryStateModel) {
    return state.expenseCategories;
  }

  @Action(CategoryActions.GetIncomeCategories)
  getAllIncomeCategories(context: StateContext<CategoryStateModel>) {
    this.incomeCategoryService
      .getAll()
      .pipe(
        map(this.getCategories)
      )
      .subscribe((incomes: Category[]) =>
        context.dispatch(new CategoryActions.GetIncomeCategorySuccess(incomes))
      );
  }

  getCategories = (apiCategories) => {
    let data: Category[] = [];

    apiCategories.forEach((apiCategory: any) => {
      data.push({
        image: apiCategory.image,
        name: apiCategory.name,
        color: apiCategory.color,
        subcategories: apiCategory.subcategories
      });
    });

    return data;
  };

  @Action(CategoryActions.GetExpenseCategories)
  getAllExpenseCategories(context: StateContext<CategoryStateModel>) {
    this.expenseCategoryService
      .getAll()
      .pipe(
        map(this.getCategories)
      )
      .subscribe((expenseCategories: Category[]) =>
        context.dispatch(
          new CategoryActions.GetExpenseCategorySuccess(expenseCategories)
        )
      );
  }

  @Action(CategoryActions.GetIncomeCategorySuccess)
  incomeCategoriesLoaded(
    ctx: StateContext<CategoryStateModel>,
    action: CategoryActions.GetIncomeCategorySuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      incomeCategories: action.payload,
    });
  }

  @Action(CategoryActions.GetExpenseCategorySuccess)
  expenseCategoriesLoaded(
    ctx: StateContext<CategoryStateModel>,
    action: CategoryActions.GetExpenseCategorySuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      expenseCategories: action.payload,
    });
  }
}
