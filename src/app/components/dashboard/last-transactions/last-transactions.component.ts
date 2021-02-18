import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models';


@Component({
  selector: 'last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss'],
})
export class LastTransactionsComponent implements OnInit {
  @Input() data: Transaction[];

  constructor() {}

  ngOnInit(): void {}

  getIcon(type: String){    
    switch (type) {
      case 'expense':
        return "angle-double-down";
        case 'income':
        return "angle-double-up";
        case 'transfer':
        return "exchange-alt";
    }
  }
}
