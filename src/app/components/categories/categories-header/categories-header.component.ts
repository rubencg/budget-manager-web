import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryTypes } from 'src/app/category';
import { CreateCategoryComponent } from '../dialogs';

@Component({
  selector: 'categories-header',
  templateUrl: './categories-header.component.html',
  styleUrls: ['./categories-header.component.scss']
})
export class CategoriesHeaderComponent implements OnInit {
  @Input() categoryType: CategoryTypes;

  constructor(public dialog: MatDialog) { }

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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Created category', result);
      } else {
        console.log('Nothing was created');
      }
    });
  }

}
