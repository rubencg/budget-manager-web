import { Component, OnInit } from '@angular/core';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'fixed-variable-expenses',
  templateUrl: './fixed-variable-expenses.component.html',
  styleUrls: ['./fixed-variable-expenses.component.scss']
})
export class FixedVariableExpensesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  data: PieElement[] = [
    {
      description: 'Gastos fijos',
      color: '#3c39ed',
      amount: 1333.33,
      icon: 'align-justify',
      percentage: 97.09
    },{
      description: 'Gastos variables',
      color: '#39edb1',
      amount: 1133.33,
      icon: 'align-center',
      percentage: 2.91
    }
  ];

}
