import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

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
  title: String;

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

      this.title = 'Nueva Categoria';
      if (this.data.category) {
        this.title = 'Editar Categoria';
        if(category.subcategories){
          category.subcategories.forEach(subcategory => {
            this.subcategories.push(subcategory);
          });
        }
        let color = this.hexToRgb(category.color.substring(1, category.color.length));
        this.form.patchValue({
          name: category.name,
          icon: category.image,
          color: new Color(color.r, color.g, color.b),
        });
        this.categoryIcons
          .filter((c) => c.icon == category.image)
          .forEach((cat) => (cat.active = true));
      }
    }
  }

  hexToRgb(hex: String): any {
    var aRgbHex = hex.match(/.{1,2}/g);
    return {
        r: parseInt(aRgbHex[0], 16),
        g: parseInt(aRgbHex[1], 16),
        b: parseInt(aRgbHex[2], 16)
    };
  }

  save() {
    let category: Category = {
      image: this.form.get('icon').value,
      name: this.form.get('name').value,
      color: '#' + this.form.get('color').value.hex,
      subcategories: this.subcategories
    };

    this.dialogRef.close(category);
  }

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

  /* Start subcategories chips */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  subcategories: String[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.subcategories.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(subcategory: String): void {
    const index = this.subcategories.indexOf(subcategory);

    if (index >= 0) {
      this.subcategories.splice(index, 1);
    }
  }

  /* End subcategories chips */
}
