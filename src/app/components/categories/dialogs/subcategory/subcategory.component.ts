import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category, CategoryTypes } from 'src/app/category';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {
  category: Category;
  categoryType: CategoryTypes;

  constructor(public dialogRef: MatDialogRef<SubcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data){
      this.categoryType = this.data.categoryType;
      this.category = this.data.category;
    }
  }

  save() {
    this.category.subcategories.push(this.form.get('name').value);

    this.dialogRef.close({
      category: this.category,
      categoryType: this.categoryType
    });
  }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

}
