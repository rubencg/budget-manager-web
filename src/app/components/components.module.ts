import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountNavComponent } from './account-nav/account-nav.component';
import { AccountNavCardComponent } from './account-nav-card/account-nav-card.component';
import { TopExpensesComponent } from './top-expenses/top-expenses.component';
import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent,
    TopExpensesComponent
  ],
  exports: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent,
    TopExpensesComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
