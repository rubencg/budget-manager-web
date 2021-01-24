import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseCategoryService } from './expense-category.service';
import { IncomeCategoryService } from './income-category.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ExpenseCategoryService,
    IncomeCategoryService
  ]
})
export class CategoryModule { }
