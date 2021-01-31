import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Category, IncomeCategoryService } from '../../category/';
import { CategoryActions } from './category.actions';

export interface CategoryStateModel {
  incomeCategories: Category[]
}

@State<CategoryStateModel>({
  name: 'categoryState',
  defaults: {
    incomeCategories: [],
  },
})
@Injectable()
export class CategoryState {
  constructor(private incomeCategoryService: IncomeCategoryService) {}

  @Selector()
  static selectIncomeCategories(state: CategoryStateModel) {
    return state.incomeCategories;
  }

  @Action(CategoryActions.GetIncomeCategories)
  getAllIncomes(context: StateContext<CategoryStateModel>) {
    this.incomeCategoryService
      .getAll()
      .pipe(
        map((apiIncomeCategories) => {
          let data: Category[] = [];

          apiIncomeCategories.forEach((apiIncomeCategory: any) => {
            data.push({
              image: apiIncomeCategory.image,
              name: apiIncomeCategory.name,
              color: apiIncomeCategory.color
            });
          });

          return data;
        })
      )
      .subscribe((incomes: Category[]) =>
        context.dispatch(new CategoryActions.GetIncomeCategorySuccess(incomes))
      );
  }

  @Action(CategoryActions.GetIncomeCategorySuccess)
  incomesLoaded(
    ctx: StateContext<CategoryStateModel>,
    action: CategoryActions.GetIncomeCategorySuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      incomeCategories: action.payload,
    });
  }
}
