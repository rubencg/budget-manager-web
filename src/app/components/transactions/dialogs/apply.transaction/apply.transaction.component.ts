import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutocompleteElement, Transaction } from 'src/app/models';

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
    this.isIncome = this.data.type == 'income';

    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((account) =>
        account
          ? this._filterElements(account, this.accounts)
          : this.accounts.slice()
      )
    );
  }

  private _filterElements(
    value: string,
    allElements: AutocompleteElement[]
  ): AutocompleteElement[] {
    const filterValue = value.toLowerCase();

    return allElements.filter(
      (element) => element.name.toLowerCase().indexOf(filterValue) === 0
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

  filteredAccounts: Observable<AutocompleteElement[]>;
  accounts: AutocompleteElement[] = [
    {
      image: 'money-bill',
      color: '#32a852',
      name: 'Ruben Efectivo',
    },
    {
      image: 'money-check-alt',
      color: '#328ba8',
      name: 'Ruben Credito',
    },
  ];

  accountCtrl = new FormControl('', [Validators.required]);
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    account: this.accountCtrl,
  });

  save(){
    let transaction: Transaction = {
      amount: this.form.get('amount').value,
      type: 'income',
      date: this.form.get('date').value,
      account: this.form.get('account').value
    }

    this.dialogRef.close(transaction);
  }
}
