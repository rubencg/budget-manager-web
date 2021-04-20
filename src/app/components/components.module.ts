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
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { AccountDialogComponent, ArchiveAccountComponent } from './accounts/dialogs';
import { ArchivedAccountsComponent, ArchivedTableComponent } from './archived-accounts';
import { ExpenseCategoriesComponent, CategoriesHeaderComponent, IncomeCategoriesComponent } from './categories';
import { MatTabsModule } from '@angular/material/tabs';
import { CategoriesContentComponent } from './categories/categories-content/categories-content.component';
import { CategoriesTableComponent } from './categories/categories-table/categories-table.component';
import { CreateCategoryComponent } from './categories/dialogs/create-category/create-category.component';
import { SubcategoryComponent } from './categories/dialogs/subcategory/subcategory.component';
import { DeleteCategoryComponent } from './categories/dialogs/delete-category/delete-category.component';
import { MatChipsModule } from '@angular/material/chips';
import { ReportsComponent } from './reports/reports/reports.component';
import { PieReportComponent } from './reports/pie-report/pie-report.component';
import { LinearReportComponent } from './reports/linear-report/linear-report.component';
import { BarReportComponent } from './reports/bar-report/bar-report.component';
import { ReportHeaderComponent } from './reports/report-header/report-header.component';
import { PieChartComponent } from './reports/pie-report/pie-chart/pie-chart.component';
import { ExpensesByCategoryComponent } from './reports/pie-report/expenses-by-category/expenses-by-category.component';
import { ExpensesByAccountComponent } from './reports/pie-report/expenses-by-account/expenses-by-account.component';
import { IncomesByCategoryComponent } from './reports/pie-report/incomes-by-category/incomes-by-category.component';
import { IncomesByAccountComponent } from './reports/pie-report/incomes-by-account/incomes-by-account.component';
import { FixedVariableExpensesComponent } from './reports/pie-report/fixed-variable-expenses/fixed-variable-expenses.component';
import { FixedVariableIncomesComponent } from './reports/pie-report/fixed-variable-incomes/fixed-variable-incomes.component';
import { ExpensesByMonthComponent } from './reports/linear-report/expenses-by-month/expenses-by-month.component';
import { LinearChartComponent } from './reports/linear-report/linear-chart/linear-chart.component';
import { ExpensesByYearComponent } from './reports/linear-report/expenses-by-year/expenses-by-year.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangeInfoComponent } from './profile/change-info/change-info.component';
import { MainAccountsComponent } from './profile/main-accounts/main-accounts.component';
import { ExpensesBySubcategoryComponent } from './reports/pie-report/expenses-by-subcategory/expenses-by-subcategory.component';

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
    ListComponent,
    AccountDialogComponent,
    ArchivedAccountsComponent,
    ArchivedTableComponent,
    ArchiveAccountComponent,
    ExpenseCategoriesComponent,
    CategoriesHeaderComponent,
    IncomeCategoriesComponent,
    CategoriesContentComponent,
    CategoriesTableComponent,
    CreateCategoryComponent,
    SubcategoryComponent,
    DeleteCategoryComponent,
    ReportsComponent,
    PieReportComponent,
    LinearReportComponent,
    BarReportComponent,
    ReportHeaderComponent,
    PieChartComponent,
    ExpensesByCategoryComponent,
    ExpensesByAccountComponent,
    IncomesByCategoryComponent,
    IncomesByAccountComponent,
    FixedVariableExpensesComponent,
    FixedVariableIncomesComponent,
    ExpensesByMonthComponent,
    LinearChartComponent,
    ExpensesByYearComponent,
    ProfileComponent,
    ChangeInfoComponent,
    MainAccountsComponent,
    ExpensesBySubcategoryComponent
  ],
  exports: [
    NavbarComponent,
    DashboardComponent,
    AccountNavComponent,
    TransactionsComponent,
    AccountsComponent,
    ArchivedAccountsComponent,
    ProfileComponent
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
    NgxMatColorPickerModule,
    MatTabsModule,
    MatChipsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ]
})
export class ComponentsModule { }
