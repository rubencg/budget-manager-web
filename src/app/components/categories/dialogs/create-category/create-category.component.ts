import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Category,
  ExpenseCategoryIcons,
  CategoryTypes,
  IncomeCategoryIcons,
} from 'src/app/category';
import { CategoryIcon } from 'src/app/models';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  type: CategoryTypes;

  constructor(
    public dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      let category: Category = this.data.category;
      this.type = this.data.categoryType;
      if (this.type == CategoryTypes.Expense) {
        ExpenseCategoryIcons.forEach((categoryIcon) => {
          this.categoryIcons.push({
            icon: categoryIcon,
            active: false,
          });
        });
      } else {
        IncomeCategoryIcons.forEach((categoryIcon) => {
          this.categoryIcons.push({
            icon: categoryIcon,
            active: false,
          });
        });
      }

      this.form.patchValue({
        name: category.name,
        icon: category.image,
        color: category.color,
      });
      this.categoryIcons
        .filter((c) => c.icon == category.image)
        .forEach((cat) => (cat.active = true));
    }
  }

  save() {
    let category: Category = {
      image: this.form.get('icon').value,
      name: this.form.get('name').value,
      color: '#' + this.form.get('color').value.hex,
    };

    this.dialogRef.close(category);
  }
  title = 'Nueva categoria';

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    icon: new FormControl('', [Validators.required]),
    color: new FormControl(new Color(255, 181, 16), [Validators.required]),
  });

  categoryIcons: CategoryIcon[] = [];

  activate(categoryIcon: CategoryIcon) {
    this.categoryIcons.forEach((icon) => {
      icon.active = false;
    });
    categoryIcon.active = true;
    this.form.get('icon').patchValue(categoryIcon.icon);
  }
}
