import { Color } from '@angular-material-components/color-picker';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Category, CategoryIcons } from 'src/app/category';
import { CategoryIcon } from 'src/app/models';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<CreateCategoryComponent>) {}

  ngOnInit(): void {
    CategoryIcons.forEach((categoryIcon) => {
      this.categoryIcons.push({
        icon: categoryIcon,
        active: false,
      });
    });
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
    this.categoryIcons.forEach(icon => {
      icon.active = false;
    });
    categoryIcon.active = true;
    this.form.get('icon').patchValue(categoryIcon.icon);
  }
}
