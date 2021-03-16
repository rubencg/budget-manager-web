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
import { AccountsComponent, AccountsHeaderComponent } from './accounts';
import { TransactionsComponent } from './transactions';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './transactions/header/header.component';
import { TableComponent } from './transactions/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DeleteComponent, ApplyTransactionComponent, IncomeComponent, ExpenseComponent, TransferComponent, FiltersComponent } from './transactions/dialogs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';;
import { ShowMoreComponent } from './transactions/dialogs/show-more/show-more.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ListComponent } from './accounts/list/list.component';
import { MatListModule } from '@angular/material/list';


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
    TableComponent,
    DeleteComponent,
    IncomeComponent,
    ExpenseComponent,
    TransferComponent,
    ShowMoreComponent,
    ApplyTransactionComponent,
    FiltersComponent,
    AccountsComponent,
    AccountsHeaderComponent,
    ListComponent
  ],
  exports: [
    NavbarComponent,
    DashboardComponent,
    AccountNavComponent,
    TransactionsComponent,
    AccountsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatTooltipModule,
    MatListModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ]
})
export class ComponentsModule { }
