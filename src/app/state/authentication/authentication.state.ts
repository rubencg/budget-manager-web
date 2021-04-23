import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { AuthService } from 'src/app/authentication/auth.service';
import { User } from 'src/app/models/user';
import { AuthenticationActions } from './authentication.actions';
import { Router } from '@angular/router';
import { AccountActions, DashboardAccountActions } from '../account';
import { CategoryActions } from '../category';
import { TransferActions } from '../transfer';
import { IncomeActions, MonthlyIncomeActions } from '../income';
import { ExpenseActions, MonthlyExpenseActions } from '../expense';

export interface AuthenticationStateModel {
  user: User;
}

@State<AuthenticationStateModel>({
  name: 'authenticationState',
  defaults: {
    user: JSON.parse(localStorage.getItem('user')),
  },
})
@Injectable()
export class AuthenticationState {
  constructor(private authService: AuthService, private store: Store) {}

  @Selector()
  static user(state: AuthenticationStateModel): User | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthenticationStateModel): boolean {
    return !!state.user;
  }

  @Action(AuthenticationActions.Login)
  login(
    ctx: StateContext<AuthenticationStateModel>,
    action: AuthenticationActions.Login
  ) {
    return this.authService
      .signIn(action.payload.username, action.payload.password)
      .then((userCredentials) => {
        const userData: User = {
          displayName: userCredentials.user.displayName,
          email: userCredentials.user.email,
          emailVerified: userCredentials.user.emailVerified,
          uid: userCredentials.user.uid,
          photoURL: userCredentials.user.photoURL,
        };

        ctx.patchState({
          user: userData,
        });
        localStorage.setItem('user', JSON.stringify(userData));

        this.store.dispatch(AccountActions.Get);
        this.store.dispatch(DashboardAccountActions.Get);
        this.store.dispatch(AccountActions.GetTypes);
        this.store.dispatch(AccountActions.GetArchivedAccounts);
        this.store.dispatch(CategoryActions.GetExpenseCategories);
        this.store.dispatch(CategoryActions.GetIncomeCategories);
        this.store.dispatch(TransferActions.Get);
        this.store.dispatch(IncomeActions.Get);
        this.store.dispatch(ExpenseActions.Get);
        this.store.dispatch(MonthlyIncomeActions.Get);
        this.store.dispatch(MonthlyExpenseActions.Get);
      });
  }

  @Action(AuthenticationActions.Logout)
  logout(ctx: StateContext<AuthenticationStateModel>) {
    return this.authService.signOut().then(() => {
      ctx.setState({
        user: null,
      });

      localStorage.setItem('user', null);
    });
  }
}
