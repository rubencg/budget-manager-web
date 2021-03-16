import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/account';
import { AccountGroup } from 'src/app/models';

@Component({
  selector: 'accounts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  accounts: Account[] = [
    {
      color: '#32a852',
      currentBalance: Math.random()*1548,
      image: 'money-bill',
      description: 'Ruben Efectivo'
    },
    {
      color: '#32a852',
      currentBalance: Math.random()*158,
      image: 'money-check-alt',
      description: 'Sarahi Efectivo'
    },
    {
      color: '#32a852',
      currentBalance: Math.random()*-1548,
      image: 'money-check-alt',
      description: 'Sarahi Debito'
    }
  ];

  accountGroups: AccountGroup[] = [
    {
      accounts: this.accounts,
      balance: this.accounts.reduce((prev, curr) => prev + curr.currentBalance, 0),
      name: 'Efectivo'
    },
    {
      accounts: this.accounts,
      balance: this.accounts.reduce((prev, curr) => prev + curr.currentBalance, 0),
      name: 'Debito'
    },
    {
      accounts: this.accounts,
      balance: this.accounts.reduce((prev, curr) => prev + curr.currentBalance, 0),
      name: 'Ahorros Ruben'
    },
  ];
  
}
