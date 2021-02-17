import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountNavCardComponent, AccountNavComponent, NavbarComponent } from './navbar/';
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BudgetCalendarComponent, DashboardComponent, LastTransactionsComponent, MonthlyBudgetComponent, TopExpensesComponent } from './dashboard';
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
    BudgetCalendarComponent,
    DashboardComponent
  ],
  exports: [
    NavbarComponent,
    DashboardComponent,
    AccountNavComponent
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
