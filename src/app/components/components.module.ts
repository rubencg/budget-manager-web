import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountNavComponent } from './account-nav/account-nav.component';
import { AccountNavCardComponent } from './account-nav-card/account-nav-card.component';



@NgModule({
  declarations: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent
  ],
  exports: [
    NavbarComponent,
    AccountNavComponent,
    AccountNavCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
