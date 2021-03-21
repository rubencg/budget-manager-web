import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutocompleteElement, Transaction } from 'src/app/models';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  title: String;

  constructor(public dialogRef: MatDialogRef<TransferComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Transaction) {
    this.filteredOriginAccounts = this.originAccountCtrl.valueChanges.pipe(
      startWith(''),
      map((account) =>
        account ? this._filterElements(account, this.accounts) : this.accounts.slice()
      )
    );

    this.filteredDestinationAccounts = this.destinationAccountCtrl.valueChanges.pipe(
      startWith(''),
      map((account) =>
        account ? this._filterElements(account, this.accounts) : this.accounts.slice()
      )
    );
  }

  private _filterElements(value: string, allElements: AutocompleteElement[]): AutocompleteElement[] {
    const filterValue = value.toLowerCase();

    return allElements.filter(
      (element) => element.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  ngOnInit(): void {
    this.title = 'Nueva transferencia';
    if(this.data != undefined && this.data != null){
      this.title = 'Editar transferencia';
      let transaction: Transaction = this.data;
      
      this.form.patchValue({
        amount: Math.abs(transaction.amount),
        date: transaction.date,
        notes: transaction.notes,
        originAccount: transaction.amount < 0 ? transaction.account : transaction.transferAccount,
        destinationAccount: transaction.amount > 0 ? transaction.account : transaction.transferAccount,
      })
    }
    
  }
  
  filteredOriginAccounts: Observable<AutocompleteElement[]>;
  filteredDestinationAccounts: Observable<AutocompleteElement[]>;
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
    {
      image: 'money-check-alt',
      color: '#a8323a',
      name: 'Ruben Debito',
    },
    {
      image: 'money-bill',
      color: '#50a832',
      name: 'Sarahi Debito',
    },
  ];

  // Form Controls
  originAccountCtrl = new FormControl('',[
    Validators.required
  ]);
  destinationAccountCtrl = new FormControl('',[
    Validators.required
  ]);
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(),[
      Validators.required
    ]),
    originAccount: this.originAccountCtrl,
    destinationAccount: this.destinationAccountCtrl,
    amount: new FormControl('', [
      Validators.required
    ]),
    notes: new FormControl('')
  });

  save(){
    let transaction: Transaction = {
      amount: this.form.get('amount').value,
      type: 'transfer',
      date: this.form.get('date').value,
      account: this.data && this.data.amount < 0 ? this.destinationAccountCtrl.value : this.originAccountCtrl.value,
      transferAccount: this.data && this.data.amount < 0 ? this.originAccountCtrl.value : this.destinationAccountCtrl.value,
      notes: this.form.get('notes').value,
    }

    this.dialogRef.close(transaction);
  }
}
