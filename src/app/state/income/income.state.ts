import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, createSelector, Store } from '@ngxs/store';
import { map, take } from 'rxjs/operators';
import { Account } from 'src/app/account';
import { Income, IncomeService } from 'src/app/income';
import { Transaction, TransactionTypes } from 'src/app/models';
import { AccountActions, AccountStateModel } from '../account';
import { IncomeActions } from './income.actions';

export interface IncomeStateModel {
  incomes: Income[];
  transactions: Transaction[];
}

@State<IncomeStateModel>({
  name: 'incomeState',
  defaults: {
    incomes: [],
    transactions: [],
  },
})
@Injectable()
export class IncomeState {
  constructor(private incomeService: IncomeService, private store: Store) {}

  static selectTransactionsForMonth(date: Date) {
    return createSelector([IncomeState], (state: IncomeStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  @Action(IncomeActions.Get)
  getAllIncomes(context: StateContext<IncomeStateModel>) {
    this.incomeService
      .getAll()
      .subscribe((inputIncomes: Income[]) =>
        {
          let incomes: Income[] = [];
          inputIncomes.forEach((t) => {
            incomes.push({
              amount: t.amount,
              date: new Date(t.date),
              toAccount: t.toAccount,
              category: t.category,
              subCategory: t.subCategory,
              isApplied: t.isApplied,
              key: t.key,
              notes: t.notes,
            });
          });
          context.dispatch(new IncomeActions.GetSuccess(incomes));
          
          let transactions: Transaction[] = [];
          incomes.forEach((t) => {
            transactions.push({
              category: t.category,
              applied: t.isApplied,
              amount: t.amount,
              date: new Date(t.date),
              account: t.toAccount,
              subcategory: t.subCategory,
              key: t.key,
              notes: t.notes,
              type: TransactionTypes.Income,
            });
          });
          context.dispatch(new IncomeActions.GetTransactionsSuccess(transactions));
        }
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

  @Action(IncomeActions.GetTransactionsSuccess)
  transactionsLoaded(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.GetTransactionsSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      transactions: action.payload,
    });
  }

  @Action(IncomeActions.DeleteIncome)
  deleteIncome(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.DeleteIncome
  ) {
    this.incomeService.delete(action.payload.key);

    if(action.payload.applied){
      ctx.dispatch(new AccountActions.AdjustAccountBalance({
        accountKey: action.payload.account.key,
        adjustment: action.payload.amount * -1
      }));
    }
  }
  
  @Action(IncomeActions.ApplyIncomeTransaction)
  applyIncome(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.ApplyIncomeTransaction
  ) {
    ctx.dispatch(new IncomeActions.SaveIncomeTransaction(action.payload));

    ctx.dispatch(new AccountActions.AdjustAccountBalance({
      accountKey: action.payload.account.key,
      adjustment: action.payload.amount
    }));
  }
  
  @Action(IncomeActions.SaveIncomeTransaction)
  saveIncomeTransaction(
    ctx: StateContext<IncomeStateModel>,
    action: IncomeActions.SaveIncomeTransaction
  ) {
    let income: Income = {
      amount: action.payload.amount,
      category: {
        image: action.payload.category.image,
        name: action.payload.category.name,
        color: action.payload.category.color,
        subcategories: action.payload.category.subcategories ? action.payload.category.subcategories : []
      },
      date: action.payload.date,
      isApplied: action.payload.applied,
      notes: action.payload.notes,
      subCategory: action.payload.subcategory ? action.payload.subcategory : null,
      toAccount: action.payload.account,
      key: action.payload.key
    };

    if(action.payload.key){
      const stateIncome: Income = ctx.getState().incomes.find(i => i.key == action.payload.key);

      if(stateIncome.isApplied){
        // Adjustment in same account
        if(stateIncome.toAccount.key == income.toAccount.key){
          let adjustment: number = income.amount - stateIncome.amount;

          this.store.dispatch(new AccountActions.AdjustAccountBalance({
            adjustment: adjustment,
            accountKey: income.toAccount.key
          }));
        } else { // Adjustment to different account
          this.store.dispatch(new AccountActions.AdjustAccountBalance({
            adjustment: stateIncome.amount * -1,
            accountKey: stateIncome.toAccount.key
          }));
          this.store.dispatch(new AccountActions.AdjustAccountBalance({
            adjustment: income.amount,
            accountKey: income.toAccount.key
          }));
        }
      }
      
      this.incomeService.update(income);
    }else{
      this.incomeService.create(income);
      if(income.isApplied){
        this.store.dispatch(new AccountActions.AdjustAccountBalance({
          adjustment: income.amount,
          accountKey: income.toAccount.key
        }));
      }
    }
  }
}
