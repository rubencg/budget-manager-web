import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from './expense.service';
import { MonthlyExpenseService } from './monthly-expense.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ExpenseService,
    MonthlyExpenseService
  ]
})
export class ExpenseModule { }
