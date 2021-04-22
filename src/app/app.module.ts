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
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthGuard } from './authentication/auth.guard';

registerLocaleData(localeES);

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
    AuthenticationModule,
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
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
