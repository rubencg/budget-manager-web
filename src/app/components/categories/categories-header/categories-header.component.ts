import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Category, CategoryTypes } from 'src/app/category';
import { CategoryActions } from 'src/app/state';
import { CreateCategoryComponent } from '../dialogs';

@Component({
  selector: 'categories-header',
  templateUrl: './categories-header.component.html',
  styleUrls: ['./categories-header.component.scss']
})
export class CategoriesHeaderComponent implements OnInit {
  @Input() categoryType: CategoryTypes;

  constructor(public dialog: MatDialog, public store: Store) { }

  ngOnInit(): void {
  }

  createCategoryDialog() {
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      data: {
        categoryType: this.categoryType
      }
    });

    dialogRef.afterClosed().subscribe((category: Category) => {
      if (category) {
        if(this.categoryType == CategoryTypes.Expense){
          this.store.dispatch(new CategoryActions.SaveExpenseCategory(category));
        }else{
          this.store.dispatch(new CategoryActions.SaveIncomeCategory(category));
        }
      }
    });
  }

}
