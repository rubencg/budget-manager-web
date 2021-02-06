import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss'],
})
export class LastTransactionsComponent implements OnInit {
  data = [
    {
      type: 'expense',
      title: 'Uber',
      amount: 50.45,
      date: new Date(2020, 0, 5),
    },
    {
      type: 'transfer',
      title: 'Ruben Credito a Ruben Debito',
      amount: 1345,
      date: new Date(2020, 0, 4),
    },
    {
      type: 'income',
      title: 'Salario',
      amount: 1000,
      date: new Date(2020, 0, 2),
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
