import { Component, Input, OnInit } from '@angular/core';
import { faExchangeAlt, faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { Transaction } from 'src/app/models';


@Component({
  selector: 'last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss'],
})
export class LastTransactionsComponent implements OnInit {
  faExchangeAlt = faExchangeAlt;
  @Input() data: Transaction[];

  constructor() {}

  ngOnInit(): void {}

  getIcon(type: String){    
    switch (type) {
      case 'expense':
        return faAngleDoubleDown;
      case 'income':
        return faAngleDoubleUp;
      case 'transfer':
        return faExchangeAlt;
    }
  }
}
