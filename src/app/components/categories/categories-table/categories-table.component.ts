import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Category, CategoryTypes } from 'src/app/category';
import { CreateCategoryComponent } from '../dialogs';

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
  @Input() categoryType: CategoryTypes;
  dataSource = new MatTableDataSource<Category>(this.data);
  
  constructor(public dialog: MatDialog) { }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Category>(this.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  editCategory(category: Category){
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      data: {
        categoryType: this.categoryType,
        category: category
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Edited category', result);
      } else {
        console.log('Nothing was edited');
      }
    });
    
  }

}
