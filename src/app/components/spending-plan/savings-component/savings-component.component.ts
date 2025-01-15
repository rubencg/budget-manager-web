import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Saving } from 'src/app/saving';

@Component({
  selector: 'app-savings-component',
  templateUrl: './savings-component.component.html',
  styleUrls: ['./savings-component.component.scss'],
})
export class SavingsComponentComponent implements AfterViewInit, OnChanges {
  @Input() savings: Saving[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Saving>([]);
  displayedColumns: string[] = ['name', 'amountPerMonth', 'savedAmount', 'goalAmount', 'leftAmount'];

  color: string = '#da60e0'

  constructor() {}
  ngAfterViewInit(): void {
    this.setDataSource();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['savings'] && changes['savings'].currentValue){
      this.setDataSource()
    }
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource<Saving>(this.savings);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
