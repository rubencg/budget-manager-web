import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/';
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BudgetCalendarComponent, DashboardComponent, LastTransactionsComponent, MonthlyBudgetComponent, TopExpensesComponent } from './dashboard';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountNavCardComponent, AccountNavComponent } from './account-nav';
import { TransactionsComponent } from './transactions';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './transactions/header/header.component';
import { TableComponent } from './transactions/table/table.component';

@NgModule({
  declarations: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent,
    TopExpensesComponent,
    LastTransactionsComponent,
    MonthlyBudgetComponent,
    BudgetCalendarComponent,
    DashboardComponent,
    TransactionsComponent,
    HeaderComponent,
    TableComponent
  ],
  exports: [
    NavbarComponent,
    DashboardComponent,
    AccountNavComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ]
})
export class ComponentsModule { }
