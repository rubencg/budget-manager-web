import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import * as Chart from 'chart.js';
import { TopExpensesModel } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    'app.component.styles.scss'
  ]
})
export class AppComponent {
  title = 'budget-manager-web';
  data: TopExpensesModel[] = [
    {name: 'Servicios', amount: 11235.78},
    {name: 'Casa', amount: 5300},
    {name: 'Despensa', amount: 7630.34},
  ];
  
  constructor(private store: Store){
    Chart.defaults.global.defaultFontColor = '#828bc2';
  }
}
