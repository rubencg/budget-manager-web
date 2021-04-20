import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import { PieElement } from 'src/app/models';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['description', 'amount', 'percentage'];
  dataSource = new MatTableDataSource<PieElement>();

  constructor() {}

  ngOnInit(): void {
    
  }

  public setData(data: Observable<PieElement[]>){
    data.subscribe((pieElements: PieElement[]) => {
      let colors: string[] = [];
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];

      pieElements.forEach((pieElement: PieElement) => {
        this.doughnutChartLabels.push(pieElement.description);
        this.doughnutChartData.push(pieElement.amount);
        colors.push(pieElement.color);
      });
      this.barChartColors[0].backgroundColor = colors;
      this.dataSource = new MatTableDataSource<PieElement>(pieElements);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

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

  /* Chart ends */
}
