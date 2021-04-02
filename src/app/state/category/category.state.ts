import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
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

  /* Income Categories */
  @Action(CategoryActions.GetIncomeCategories)
  getAllIncomeCategories(context: StateContext<CategoryStateModel>) {
    this.incomeCategoryService
      .getAll()
      .subscribe((categories: Category[]) =>
        context.dispatch(
          new CategoryActions.GetIncomeCategorySuccess(categories)
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
  /* Ends Income Categories */

  /* Expense Categories */
  @Action(CategoryActions.GetExpenseCategories)
  getAllExpenseCategories(context: StateContext<CategoryStateModel>) {
    this.expenseCategoryService
      .getAll()
      .subscribe((categories: Category[]) =>
        context.dispatch(
          new CategoryActions.GetExpenseCategorySuccess(categories)
        )
      );
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

  @Action(CategoryActions.SaveExpenseCategory)
  saveExpenseCategory(context: StateContext<CategoryStateModel>,
    action: CategoryActions.SaveExpenseCategory){
      const category: Category = action.payload;
      // Update 
      if(category.key){
        this.expenseCategoryService.update(category);
      } else { // Insert
        this.expenseCategoryService.create(category);
      }
  }

  @Action(CategoryActions.DeleteExpenseCategory)
  deleteExpenseCategory(context: StateContext<CategoryStateModel>,
    action: CategoryActions.DeleteExpenseCategory){
      this.expenseCategoryService.delete(action.payload);
  }
  /* Ends Expense Categories */
}
