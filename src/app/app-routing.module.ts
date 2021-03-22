import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, TransactionsComponent } from './components';
import { AccountsComponent } from './components/accounts';
import { ArchivedAccountsComponent } from './components/archived-accounts/archived-accounts.component';
import { CategoriesContentComponent, ExpenseCategoriesComponent, IncomeCategoriesComponent } from './components/categories';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'archived-accounts', component: ArchivedAccountsComponent },
  { path: 'categories', component: CategoriesContentComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
