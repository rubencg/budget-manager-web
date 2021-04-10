import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeService } from './income.service';
import { MonthlyIncomeService } from './monthly-income.service';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule
  ],
  providers: [
    IncomeService,
    MonthlyIncomeService
  ]
})
export class IncomeModule { }
