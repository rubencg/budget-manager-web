import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import { Expense } from 'src/app/expense';
import { PieElement, Transaction } from 'src/app/models';
import { ChartType, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-other-expenses',
  templateUrl: './other-expenses.component.html',
  styleUrls: ['./other-expenses.component.scss'],
})
export class OtherExpensesComponent implements AfterViewInit, OnChanges {
  @Input() expenses: Transaction[];
  expensesSource = new MatTableDataSource<Transaction>();
  displayedColumns: string[];

  /* Chart start */

  public doughnutChartLabels: String[] = [];
  public doughnutChartData = [];
  public doughnutChartType: ChartType = 'pie';
  public barChartColors: Color[] = [
    {
      backgroundColor: [],
    },
  ];
  public options: ChartOptions = {
    circumference: Math.PI * 2,
    rotation: Math.PI,
    legend: {
      display: true,
    },
  };

  /* Chart ends */

  constructor(private deviceService: DeviceDetectorService) {
    this.displayedColumns = this.deviceService.isMobile()
      ? ['transaction-content']
      : ['date', 'category', 'account', 'amount', 'notes', 'actions'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] && changes['expenses'].currentValue) {
      this.expenses = changes['expenses'].currentValue;
      this.setExpenseSource();
    }
  }

  ngAfterViewInit(): void {
    this.setExpenseSource();
  }

  setExpenseSource() {
    this.expensesSource = new MatTableDataSource<Transaction>(this.expenses);
    this.setPieData();
  }

  setPieData() {
    const appliedExpenses = this.expenses as unknown as Expense[];

    // group expenses by category
    const expensesByCategory = _.groupBy(
      appliedExpenses,
      (e: Expense) => e.category.name
    );
    const totalAmount = appliedExpenses.reduce(
      (a, b: Expense) => +a + b.amount,
      0
    );

    const pieElements: PieElement[] = _.map(
      expensesByCategory,
      function (value: Expense[], key) {
        const categoryAmount = value.reduce(
          (a, b: Expense) => +a + b.amount,
          0
        );
        const pieElement: PieElement = {
          description: key,
          amount: parseFloat(categoryAmount.toFixed(2)),
          color: value[0].category.color,
          icon: value[0].category.image,
          percentage:
            parseFloat((categoryAmount / totalAmount).toFixed(2)) * 100,
        };
        return pieElement;
      }
    );

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
}
