import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Expense, ExpenseService } from 'src/app/expense';
import { ExpenseActions } from './expense.actions';

export interface ExpenseStateModel {
  expenses: Expense[];
}

@State<ExpenseStateModel>({
  name: 'expenseState',
  defaults: {
    expenses: [],
  },
})
@Injectable()
export class ExpenseState {
  constructor(private expenseService: ExpenseService) {}

  @Selector()
  static selectExpenses(state: ExpenseStateModel) {
    return state.expenses;
  }

  @Action(ExpenseActions.Get)
  getAllExpenses(context: StateContext<ExpenseStateModel>) {
    this.expenseService
      .getAll()
      .pipe(
        map((apiExpenses) => {
          let data: Expense[] = [];

          apiExpenses.forEach((apiExpense: any) => {
            data.push({
              amount: apiExpense.amount,
              date: new Date(+apiExpense.date),
              notes: apiExpense.notes,
              fromAccount: {
                image: apiExpense.img,
                name: apiExpense.name,
              },
              category: {
                image: apiExpense.category.img,
                name: apiExpense.category.name,
              },
              subCategory: apiExpense.category.subcategory.name
            });
          });

          return data;
        })
      )
      .subscribe((Expenses: Expense[]) =>
        context.dispatch(new ExpenseActions.GetSuccess(Expenses))
      );
  }

  @Action(ExpenseActions.GetSuccess)
  ExpensesLoaded(
    ctx: StateContext<ExpenseStateModel>,
    action: ExpenseActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      expenses: action.payload,
    });
  }
}
