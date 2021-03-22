import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/category';

@Component({
  selector: 'categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'name',
    'actions',
  ];
  @Input() data: Category[] = [];
  dataSource = new MatTableDataSource<Category>(this.data);
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Category>(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
