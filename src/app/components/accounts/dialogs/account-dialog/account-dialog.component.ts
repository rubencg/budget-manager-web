import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Account, AccountIcons } from 'src/app/account';
import { AutocompleteElement } from 'src/app/models';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
})
export class AccountDialogComponent implements OnInit {
  accountIcons = AccountIcons;
  title: String;

  constructor(public dialogRef: MatDialogRef<AccountDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Account) {
    this.filteredAccountTypes = this.accountTypeCtrl.valueChanges.pipe(
      startWith(''),
      map((account) =>
        account ? this._filterElements(account, this.accountTypes) : this.accountTypes.slice()
      )
    );
  }

  private _filterElements(value: string, allElements: AutocompleteElement[]): AutocompleteElement[] {
    const filterValue = value.toLowerCase();

    return allElements.filter(
      (element) => element.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  save() {
    let account: Account = {
      accountType: {
        name: this.accountTypeCtrl.value
      },
      color: '#' + this.form.get('color').value.hex,
      description: this.form.get('name').value,
      image: this.form.get('icon').value,
      sumsToMonthlyBudget: this.form.get('isSummable').value,
      currentBalance: this.form.get('currentBalance').value,
    };

    this.dialogRef.close(account);
  }

  filteredAccountTypes: Observable<AutocompleteElement[]>;
  accountTypes: AutocompleteElement[] = [
    {
      name: 'Efectivo',
    },
    {
      name: 'Debito',
    },
    {
      name: 'Credito',
    },
    {
      name: 'Ruben Ahorros',
    },
    {
      name: 'Sarahi Ahorros',
    },
  ];

  accountTypeCtrl = new FormControl(this.accountTypes[0].name, [Validators.required]);
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    currentBalance: new FormControl('0', [Validators.required]),
    color: new FormControl(new Color(255, 243, 0), [Validators.required]),
    accountType: this.accountTypeCtrl,
    isSummable: new FormControl(true),
    icon: new FormControl(this.accountIcons[0]),
  });

  ngOnInit(): void {
    this.title = 'Nueva cuenta';
    if(this.data != undefined && this.data != null){
      this.title = 'Editar cuenta';
      let account: Account = this.data;
      let color = this.hexToRgb(account.color.substring(1, account.color.length));
      
      this.form.patchValue({
        name: account.description,
        currentBalance: account.currentBalance,
        accountType: account.accountType.name,
        color: new Color(color.r, color.g, color.b), // ToDo: Change these values to get from key
        isSummable: account.sumsToMonthlyBudget,
        icon: account.image,
      })
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
}
