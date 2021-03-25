import { Component, OnInit } from '@angular/core';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'fixed-variable-incomes',
  templateUrl: './fixed-variable-incomes.component.html',
  styleUrls: ['./fixed-variable-incomes.component.scss']
})
export class FixedVariableIncomesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  data: PieElement[] = [
    {
      description: 'Ingresos fijos',
      color: '#39ed69',
      amount: 1333.33,
      icon: 'align-justify',
      percentage: 97.09
    },{
      description: 'Ingresos variables',
      color: '#a23deb',
      amount: 1133.33,
      icon: 'align-center',
      percentage: 2.91
    }
  ];

}
