import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'account-nav',
  templateUrl: 'account-nav.html',
  styleUrls: [
    'account-nav.style.scss'
  ]
})
export class AccountNavComponent implements OnInit {
  cards = [
    {
      accountName: 'Ruben Credito',
      accountBalance: -8709.74,
      cardLastFour: '5080',
      color: 'purple'
    },
    {
      accountName: 'Sarahi Credito',
      accountBalance: -1300,
      cardLastFour: '2347',
      color: 'pink'
    },
    {
      accountName: 'Ruben Debito',
      accountBalance: 31200,
      cardLastFour: '9292',
      color: 'light-blue'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
