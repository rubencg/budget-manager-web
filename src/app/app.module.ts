import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AccountModule } from './account/account.module';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeCategoryModule } from './income-category/income-category.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccountModule,
    IncomeModule,
    ExpenseModule,
    IncomeCategoryModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
