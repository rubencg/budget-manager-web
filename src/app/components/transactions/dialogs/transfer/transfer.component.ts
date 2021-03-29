import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Account } from 'src/app/account';
import { Transaction } from 'src/app/models';
import { AccountState, TransferActions } from 'src/app/state';
import { Transfer } from 'src/app/transfer';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  title: String;
  @Select(AccountState.selectAccounts) accounts$: Observable<Account[]>;
  filteredOriginAccounts: Observable<Account[]>;
  filteredDestinationAccounts: Observable<Account[]>;

  constructor(
    public dialogRef: MatDialogRef<TransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction,
    public store: Store
  ) {
    this.filteredOriginAccounts = this.originAccountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      switchMap((val) => this._filterElements(val))
    );

    this.filteredDestinationAccounts = this.destinationAccountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      switchMap((val) => this._filterElements(val))
    );
  }

  private _filterElements(value: string): Observable<Account[]> {
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

  displayFn(account: Account) {
    return account ? account.name : '';
  }

  ngOnInit(): void {
    this.title = 'Nueva transferencia';
    if (this.data != undefined && this.data != null) {
      this.title = 'Editar transferencia';
      let transaction: Transaction = this.data;

      this.form.patchValue({
        amount: Math.abs(transaction.amount),
        date: transaction.date,
        notes: transaction.notes,
        originAccount:
          transaction.amount < 0
            ? transaction.account
            : transaction.transferAccount,
        destinationAccount:
          transaction.amount > 0
            ? transaction.account
            : transaction.transferAccount,
      });
    }
  }

  // Form Controls
  originAccountCtrl = new FormControl('', [Validators.required]);
  destinationAccountCtrl = new FormControl('', [Validators.required]);
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    originAccount: this.originAccountCtrl,
    destinationAccount: this.destinationAccountCtrl,
    amount: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  save() {
    let transaction: Transaction = {
      amount: this.form.get('amount').value,
      type: 'transfer',
      date: this.form.get('date').value,
      account: this.originAccountCtrl.value,
      transferAccount: this.destinationAccountCtrl.value,
      notes: this.form.get('notes').value,
    };

    let transfer: Transfer = {
      amount: transaction.amount,
      date: transaction.date,
      fromAccount: transaction.account,
      toAccount: transaction.transferAccount
    };

    this.store.dispatch(new TransferActions.SaveTransfer(transfer));

    this.dialogRef.close(transaction);
  }
}
