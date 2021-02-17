import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    'app.component.styles.scss'
  ]
})
export class AppComponent {
  title = 'budget-manager-web';
  
  constructor(private store: Store){
    Chart.defaults.global.defaultFontColor = '#828bc2';
    Chart.defaults.global.defaultFontFamily = 'Maven Pro';
  }
}
