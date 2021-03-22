import { Color } from '@angular-material-components/color-picker';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateCategoryComponent>) { }

  ngOnInit(): void {
  }

  save(){
    let category: Category ={
      image: '', // ToDo: Add image
      name: this.form.get('name').value,
      color: '#' + this.form.get('color').value.hex,
    };

    this.dialogRef.close(category);
  }
  title ='Nueva categoria';

  form: FormGroup = new FormGroup({
    name: new FormControl('',[
      Validators.required
    ]),
    color: new FormControl(new Color(255, 243, 0), [Validators.required]),
  });

}
