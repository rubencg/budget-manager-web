import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
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
    private expenseCategoryService: ExpenseCategoryService,
    private store: Store
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
      .getAll(this.store.selectSnapshot((state) => state.authenticationState.user).uid)
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

  @Action(CategoryActions.SaveIncomeCategory)
  saveIncomeCategory(context: StateContext<CategoryStateModel>,
    action: CategoryActions.SaveIncomeCategory){
      const category: Category = action.payload;
      const uid: string = this.store.selectSnapshot((state) => state.authenticationState.user).uid;
      // Update 
      if(category.key){
        this.incomeCategoryService.update(uid, category);
      } else { // Insert
        this.incomeCategoryService.create(uid, category);
      }
  }

  @Action(CategoryActions.DeleteIncomeCategory)
  deleteIncomeCategory(context: StateContext<CategoryStateModel>,
    action: CategoryActions.DeleteIncomeCategory){
      this.incomeCategoryService.delete(this.store.selectSnapshot((state) => state.authenticationState.user).uid, action.payload);
  }
  /* Ends Income Categories */

  /* Expense Categories */
  @Action(CategoryActions.GetExpenseCategories)
  getAllExpenseCategories(context: StateContext<CategoryStateModel>) {
    this.expenseCategoryService
      .getAll(this.store.selectSnapshot((state) => state.authenticationState.user).uid)
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
      const uid: string = this.store.selectSnapshot((state) => state.authenticationState.user).uid;
      // Update 
      if(category.key){
        this.expenseCategoryService.update(uid, category);
      } else { // Insert
        this.expenseCategoryService.create(uid, category);
      }
  }

  @Action(CategoryActions.DeleteExpenseCategory)
  deleteExpenseCategory(context: StateContext<CategoryStateModel>,
    action: CategoryActions.DeleteExpenseCategory){
      this.expenseCategoryService.delete(this.store.selectSnapshot((state) => state.authenticationState.user).uid, action.payload);
  }
  /* Ends Expense Categories */
}
