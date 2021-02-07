import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountNavComponent } from './account-nav/account-nav.component';
import { AccountNavCardComponent } from './account-nav-card/account-nav-card.component';
import { TopExpensesComponent } from './top-expenses/top-expenses.component';
import { ChartsModule } from 'ng2-charts';
import { LastTransactionsComponent } from './last-transactions/last-transactions.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MonthlyBudgetComponent } from './monthly-budget/monthly-budget.component';
import { BudgetCalendarComponent } from './budget-calendar/budget-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent,
    TopExpensesComponent,
    LastTransactionsComponent,
    MonthlyBudgetComponent,
    BudgetCalendarComponent
  ],
  exports: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent,
    TopExpensesComponent,
    LastTransactionsComponent,
    MonthlyBudgetComponent,
    BudgetCalendarComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ]
})
export class ComponentsModule { }
