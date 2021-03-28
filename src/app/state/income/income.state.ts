import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Income, IncomeService } from 'src/app/income';
import { IncomeActions } from './income.actions';

export interface IncomeStateModel {
  incomes: Income[];
}

@State<IncomeStateModel>({
  name: 'incomeState',
  defaults: {
    incomes: [],
  },
})
@Injectable()
export class IncomeState {
  constructor(private incomeService: IncomeService) {}

  @Selector()
  static selectIncomes(state: IncomeStateModel) {
    return state.incomes;
  }

  @Action(IncomeActions.Get)
  getAllIncomes(context: StateContext<IncomeStateModel>) {
    this.incomeService
      .getAll()
      .pipe(
        map((apiIncomes) => {
          let data: Income[] = [];

          apiIncomes.forEach((apiIncome: any) => {
            data.push({
              amount: apiIncome.amount,
              date: new Date(+apiIncome.date),
              isApplied: apiIncome.isApplied,
              notes: apiIncome.notes,
              toAccount: {
                image: apiIncome.img,
                name: apiIncome.name,
              },
              category: {
                image: apiIncome.category.img,
                name: apiIncome.category.name,
              },
            });
          });

          return data;
        })
      )
      .subscribe((incomes: Income[]) =>
        context.dispatch(new IncomeActions.GetSuccess(incomes))
      );
  }

  @Action(IncomeActions.GetSuccess)
  incomesLoaded(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      incomes: action.payload,
    });
  }
}
