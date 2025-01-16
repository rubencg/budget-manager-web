import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseCategoryIcons } from 'src/app/category';
import { CategoryIcon } from 'src/app/models';
import { Saving } from 'src/app/saving';

@Component({
  selector: 'app-saving',
  templateUrl: './saving.component.html',
  styleUrls: ['./saving.component.scss'],
})
export class SavingComponent implements OnInit {
  title: String;
  categoryIcons: CategoryIcon[] = [];

  constructor(
    public dialogRef: MatDialogRef<SavingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Saving
  ) {}

  ngOnInit(): void {
    this.title = 'Nuevo ahorro';
    ExpenseCategoryIcons.forEach((categoryIcon) => {
      this.categoryIcons.push({
        icon: categoryIcon,
        active: false,
      });
    });
    if (this.data != undefined && this.data != null) {
      this.title = 'Editar ahorro';
      let color = this.hexToRgb(
        this.data.color.substring(1, this.data.color.length)
      );

      this.form.patchValue({
        name: this.data.name,
        savedAmount: this.data.savedAmount,
        goalAmount: this.data.goalAmount,
        amountPerMonth: this.data.amountPerMonth,
        color: new Color(color.r, color.g, color.b),
        icon: this.data.icon,
      });
      this.categoryIcons
        .filter((c) => c.icon == this.data.icon)
        .forEach((cat) => (cat.active = true));
    }
  }

  activate(categoryIcon: CategoryIcon) {
    this.categoryIcons.forEach((icon) => {
      icon.active = false;
    });
    categoryIcon.active = true;
    this.form.get('icon').patchValue(categoryIcon.icon);
  }

  hexToRgb(hex: String): any {
    var aRgbHex = hex.match(/.{1,2}/g);
    return {
      r: parseInt(aRgbHex[0], 16),
      g: parseInt(aRgbHex[1], 16),
      b: parseInt(aRgbHex[2], 16),
    };
  }

  // Form Controls
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    savedAmount: new FormControl('', [Validators.required]),
    goalAmount: new FormControl('', [Validators.required]),
    amountPerMonth: new FormControl('', [Validators.required]),
    color: new FormControl(new Color(255, 243, 0), [Validators.required]),
    icon: new FormControl('', [Validators.required]),
  });

  save() {
    let saving: Saving = {
      name: this.form.get('name').value,
      savedAmount: this.form.get('savedAmount').value,
      goalAmount: this.form.get('goalAmount').value,
      amountPerMonth: this.form.get('amountPerMonth').value,
      color: '#' + this.form.get('color').value.hex,
      icon: this.form.get('icon').value,
      key: this.data ? this.data.key : undefined,
    };

    this.dialogRef.close(saving);
  }
}
