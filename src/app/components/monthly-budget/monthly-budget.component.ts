import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MonthlyBudget } from 'src/app/models';

@Component({
  selector: 'monthly-budget',
  templateUrl: './monthly-budget.component.html',
  styleUrls: ['./monthly-budget.component.scss']
})
export class MonthlyBudgetComponent implements OnInit {

  @Input() monthlyBudgetData: MonthlyBudget;
  public totalforMonth: number;

  // Doughnut
  public doughnutChartLabels: Label[] = ['Gasto proyectado', 'Gastos', 'Entradas'];
  public doughnutChartData = [];
  public doughnutChartType: ChartType = 'doughnut';
  public options: ChartOptions = {
    circumference: Math.PI,
    rotation: Math.PI,
    legend: {
      display: false
    }
  };
  public barChartColors: Color[] = [
    {
      backgroundColor: [
        'rgba(138, 22, 255, 0.7)',
        'rgba(255, 37, 194, 0.7)',
        'rgba(36, 223, 254, 0.7)',
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void {
    this.doughnutChartData.push(this.monthlyBudgetData.budgetExpensesAmount);
    this.doughnutChartData.push(this.monthlyBudgetData.expensesAmount);
    this.doughnutChartData.push(this.monthlyBudgetData.incomesAmount);
    this.totalforMonth = this.calculateTotalForMonth();
  }

  calculateTotalForMonth() : number{
    return this.monthlyBudgetData.currentBalance
      - this.monthlyBudgetData.budgetExpensesAmount;
  }

}
