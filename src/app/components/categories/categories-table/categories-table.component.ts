import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category, CategoryTypes } from 'src/app/category';
import { CategoryActions } from 'src/app/state';
import { CreateCategoryComponent } from '../dialogs';
import { DeleteCategoryComponent } from '../dialogs/delete-category/delete-category.component';
import { SubcategoryComponent } from '../dialogs/subcategory/subcategory.component';

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
  @Input() data: Observable<Category[]>;
  @Input() categoryType: CategoryTypes;
  dataSource = new MatTableDataSource<Category>();
  
  constructor(public dialog: MatDialog, public store: Store) { }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    this.data.subscribe(
      (state) => {
        this.dataSource = new MatTableDataSource<Category>(state);
      }
    )
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

    dialogRef.afterClosed().subscribe((editedCategory: Category) => {
      if (editedCategory) {
        if(this.categoryType == CategoryTypes.Expense){
          this.store.dispatch(new CategoryActions.SaveExpenseCategory({
            image: editedCategory.image,
            name: editedCategory.name,
            subcategories: editedCategory.subcategories,
            color: editedCategory.color,
            key: category.key,
          }));
        }else{
          // ToDo: Save income expense
        }
      }
    });
    
  }

  addSubcategory(category: Category){
    const dialogRef = this.dialog.open(SubcategoryComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      data: {
        categoryType: this.categoryType,
        category: category
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Added subcategory', result);
      } else {
        console.log('Nothing was added');
      }
    });
    
  }

  deleteCategory(category: Category){
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      data: category
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Deleted category', result);
      } else {
        console.log('Nothing was deleted');
      }
    });
  }

}
