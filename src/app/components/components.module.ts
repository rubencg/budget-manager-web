import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountNavComponent } from './account-nav/account-nav.component';
import { AccountNavCardComponent } from './account-nav-card/account-nav-card.component';
import { TopExpensesComponent } from './top-expenses/top-expenses.component';
import { ChartsModule } from 'ng2-charts';
import { LastTransactionsComponent } from './last-transactions/last-transactions.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent,
    TopExpensesComponent,
    LastTransactionsComponent
  ],
  exports: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent,
    TopExpensesComponent,
    LastTransactionsComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    FontAwesomeModule
  ]
})
export class ComponentsModule { }
