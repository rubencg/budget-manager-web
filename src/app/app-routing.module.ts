import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, TransactionsComponent } from './components';
import { AccountsComponent } from './components/accounts';
import { ArchivedAccountsComponent } from './components/archived-accounts/archived-accounts.component';
import { CategoriesContentComponent } from './components/categories';
import { ProfileComponent } from './components/profile/profile.component';
import { ReportsComponent } from './components/reports/reports/reports.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuard } from './authentication/auth.guard';
import { SpendingPlanContentComponent } from './components/spending-plan';

const routes: Routes = [
  { path: 'login', component: LoginComponent, },
  { path: 'dashboard', component: DashboardComponent,  canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent,  canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent,  canActivate: [AuthGuard] },
  { path: 'archived-accounts', component: ArchivedAccountsComponent,  canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent,  canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesContentComponent,  canActivate: [AuthGuard] },
  { path: 'spending-plan', component: SpendingPlanContentComponent,  canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard] },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
