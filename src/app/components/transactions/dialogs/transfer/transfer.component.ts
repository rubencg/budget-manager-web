import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutocompleteElement } from 'src/app/models';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TransferComponent>) {
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

}
