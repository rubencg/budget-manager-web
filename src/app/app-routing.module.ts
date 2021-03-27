import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, TransactionsComponent } from './components';
import { AccountsComponent } from './components/accounts';
import { ArchivedAccountsComponent } from './components/archived-accounts/archived-accounts.component';
import { CategoriesContentComponent } from './components/categories';
import { ProfileComponent } from './components/profile/profile.component';
import { ReportsComponent } from './components/reports/reports/reports.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'archived-accounts', component: ArchivedAccountsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'categories', component: CategoriesContentComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
