import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AutocompleteElement, Transaction, TransactionTypes } from 'src/app/models';
import { AccountState } from 'src/app/state';

@Component({
  selector: 'app-apply.transaction',
  templateUrl: './apply.transaction.component.html',
  styleUrls: ['./apply.transaction.component.scss'],
})
export class ApplyTransactionComponent implements OnInit {
  isIncome: Boolean;

  constructor(
    public dialogRef: MatDialogRef<ApplyTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction
  ) {
    this.isIncome = this.data.type == TransactionTypes.Income || 
      this.data.type == TransactionTypes.MonthlyIncome;

    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      switchMap((val) => this._filterAccountElements(val))
    );
  }

  @Select(AccountState.selectAccounts) accounts$: Observable<Account[]>;
  filteredAccounts: Observable<Account[]>;

  private _filterAccountElements(value: string): Observable<Account[]> {
    return this.accounts$.pipe(
      map((response) => {
        return value
          ? response.filter((account) =>
              account.name.toLowerCase().includes(value.toLowerCase())
            )
          : response;
      })
    );
  }

  ngOnInit(): void {
    if(this.data != undefined && this.data != null){
      let transaction: Transaction = this.data;
      
      this.form.patchValue({
        amount: transaction.amount,
        date: new Date(),
        account: transaction.account
      })
    }
  }

  displayAccountFn(account: Account) {
    return account ? account.name : '';
  }

  accountCtrl = new FormControl('', [Validators.required]);
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    account: this.accountCtrl,
  });

  save(){
    let transaction: Transaction = {
      amount: this.form.get('amount').value,
      type: this.data.type,
      date: this.form.get('date').value,
      account: this.form.get('account').value,
      key: this.data.key,
      category: this.data.category,
      subcategory: this.data.subcategory,
      notes: this.data.notes,
      applied: true
    }

    this.dialogRef.close(transaction);
  }
}
