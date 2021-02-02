import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

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
    
  }
}
