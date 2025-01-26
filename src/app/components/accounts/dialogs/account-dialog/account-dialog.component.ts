import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { Account, AccountIcons, AccountType } from 'src/app/account';
import { AutocompleteElement } from 'src/app/models';
import { AccountState, AccountStateModel } from 'src/app/state';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
})
export class AccountDialogComponent implements OnInit {
  accountIcons = AccountIcons;
  title: String;

  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Account
  ) {
    this.filteredAccountTypes = this.accountTypeCtrl.valueChanges.pipe(
      startWith(''),
      switchMap((val) => this._filterElements(val || ''))
    );
  }

  private _filterElements(value: string): Observable<AutocompleteElement[]> {
    return this.accountTypes$.pipe(
      map((response) => {
        return response.filter(
          (type) => type.name.toLowerCase().indexOf(value.toLowerCase()) === 0
        ).map(element => {
          let autoCompleteElement: AutocompleteElement = {
            name: element.name
          };
          return autoCompleteElement;
        });
      })
    );
  }

  save() {
    let account: Account = {
      accountType: {
        name: this.accountTypeCtrl.value,
      },
      color: '#' + this.form.get('color').value.hex,
      name: this.form.get('name').value,
      image: this.form.get('icon').value,
      sumsToMonthlyBudget: this.form.get('isSummable').value,
      currentBalance: this.form.get('currentBalance').value,
    };

    this.dialogRef.close(account);
  }

  filteredAccountTypes: Observable<AutocompleteElement[]>;
  @Select(AccountState.selectAccountTypes) accountTypes$: Observable<AccountType[]>;

  accountTypeCtrl = new FormControl('', [
    Validators.required,
  ]);
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    currentBalance: new FormControl(0, [Validators.required]),
    color: new FormControl(new Color(255, 243, 0), [Validators.required]),
    accountType: this.accountTypeCtrl,
    isSummable: new FormControl(true),
    icon: new FormControl(this.accountIcons[0]),
  });

  ngOnInit(): void {
    this.title = 'Nueva cuenta';
    if (this.data != undefined && this.data != null) {
      this.title = 'Editar cuenta';
      let account: Account = this.data;
      let color = this.hexToRgb(
        account.color.substring(1, account.color.length)
      );

      this.form.patchValue({
        name: account.name,
        currentBalance: account.currentBalance,
        accountType: account.accountType.name,
        color: new Color(color.r, color.g, color.b),
        isSummable: account.sumsToMonthlyBudget,
        icon: account.image,
      });
    }
  }

  hexToRgb(hex: String): any {
    var aRgbHex = hex.match(/.{1,2}/g);
    return {
      r: parseInt(aRgbHex[0], 16),
      g: parseInt(aRgbHex[1], 16),
      b: parseInt(aRgbHex[2], 16),
    };
  }
}
