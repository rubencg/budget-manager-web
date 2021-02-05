import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { budgetManagerState } from './state';
import { AccountModule } from './account';
import { IncomeModule } from './income';
import { ExpenseModule } from './expense';
import { CategoryModule } from './category';
import { TransferModule } from './transfer';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { ComponentsModule } from './components';
import { ChartsModule } from 'ng2-charts';

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
    CategoryModule,
    TransferModule,
    ComponentsModule,
    ChartsModule,
    NgxsModule.forRoot(
      budgetManagerState, {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
