import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'app-available-graph',
  templateUrl: './available-graph.component.html',
  styleUrls: ['./available-graph.component.scss'],
})
export class AvailableGraphComponent implements OnInit, OnChanges {
  @Input() availableAmount: number = 680.09;
  availableColor: string;
  @Input() otherSpentAmount: number = 208.2;
  otherColor: string;
  @Input() plannedSpendingAmount: number = 400.98;
  plannedColor: string;

  /* Chart start */

  public doughnutChartLabels: String[] = [];
  public doughnutChartData = [];
  public doughnutChartType: ChartType = 'doughnut';
  public barChartColors: Color[] = [
    {
      backgroundColor: [],
    },
  ];
  public options: ChartOptions = {
    circumference: Math.PI,
    rotation: Math.PI,
    legend: {
      display: false,
    },
  };

  setPieData() {
    if (
      !this.availableAmount ||
      !this.otherSpentAmount ||
      !this.plannedSpendingAmount
    )
      return;

    const total =
      this.availableAmount + this.otherSpentAmount + this.plannedSpendingAmount;
    const pieElements: PieElement[] = [
      {
        amount: parseFloat(this.availableAmount.toFixed(2)),
        color: this.availableColor,
        description: 'Disponible',
        percentage: this.availableAmount / total,
        icon: undefined,
      },
      {
        amount: parseFloat(this.otherSpentAmount.toFixed(2)),
        color: this.otherColor,
        description: 'Otros gastos',
        percentage: this.otherSpentAmount / total,
        icon: undefined,
      },
      {
        amount: parseFloat(this.plannedSpendingAmount.toFixed(2)),
        color: this.plannedColor,
        description: 'Gastos planeados',
        percentage: this.plannedSpendingAmount / total,
        icon: undefined,
      },
    ];

    let colors: string[] = [];
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];

    pieElements.forEach((pieElement: PieElement) => {
      this.doughnutChartLabels.push(pieElement.description);
      this.doughnutChartData.push(pieElement.amount);
      colors.push(pieElement.color);
    });
    this.barChartColors[0].backgroundColor = colors;
  }

  /* Chart ends */

  constructor(private el: ElementRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.setPieData();
  }

  ngOnInit(): void {
    const styles = getComputedStyle(this.el.nativeElement);
    this.availableColor = styles.getPropertyValue('--income-color').trim();
    this.otherColor = styles.getPropertyValue('--pink').trim();
    this.plannedColor = styles.getPropertyValue('--purple').trim();

    this.setPieData();
  }
}
