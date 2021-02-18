import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, TransactionsComponent } from './components';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
