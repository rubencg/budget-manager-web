import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from './account.service';
import { DashboardAccountService } from './dashboard-account.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [
    AccountService,
    DashboardAccountService
  ]
})
export class AccountModule { }
