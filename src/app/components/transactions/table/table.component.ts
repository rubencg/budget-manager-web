import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models';

const ELEMENT_DATA: Transaction[] = [
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
  {type: 'expense', amount: 157.64, date: new Date(), account: 'Ruben Debito', notes: 'Pastillas para la alergia', category: 'Farmacia'},
];


@Component({
  selector: 'transactions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['date', 'category', 'account', 'amount', 'notes', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
