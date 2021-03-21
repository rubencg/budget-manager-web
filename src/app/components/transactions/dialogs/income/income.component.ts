import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutocompleteElement, Transaction } from 'src/app/models';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  showMoreEnabled: Boolean = true;
  title: String;

  constructor(public dialogRef: MatDialogRef<IncomeComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Transaction) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(''),
      map((category) =>
        category
          ? this._filterElements(category, this.categories)
          : this.categories.slice()
      )
    );
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
    this.title = 'Nuevo ingreso';
    if(this.data != undefined && this.data != null){
      this.title = 'Editar ingreso';
      this.showMoreEnabled = false;
      let transaction: Transaction = this.data;
      
      this.form.patchValue({
        amount: transaction.amount,
        date: transaction.date,
        notes: transaction.notes,
        category: transaction.category, // ToDo: Change these values to get from key
        account: transaction.account,
        applied: transaction.applied,
      })
    }
  }

  filteredCategories: Observable<AutocompleteElement[]>;
  categories: AutocompleteElement[] = [
    {
      image: 'briefcase',
      color: '#32a852',
      name: 'Salario',
    },
    {
      image: 'hand-holding-usd',
      color: '#c4412f',
      name: 'Bono',
    },
    {
      image: 'bible',
      color: '#e8d227',
      name: 'Iglesia',
    },
  ];

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

  // Form Controls
  categoryCtrl = new FormControl('', [Validators.required]);
  accountCtrl = new FormControl('', [Validators.required]);
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    category: this.categoryCtrl,
    account: this.accountCtrl,
    applied: new FormControl(true),
    amount: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    monthlyRecurrent: new FormControl(''),
    repeat: new FormControl(false),
    times: new FormControl(''),
    recurrence: new FormControl(''),
  });

  save(){
    let transaction: Transaction = {
      amount: this.form.get('amount').value,
      type: 'income',
      date: this.form.get('date').value,
      account: this.form.get('account').value,
      category: this.form.get('category').value,
      notes: this.form.get('notes').value,
      applied: this.form.get('applied').value,
    }

    this.dialogRef.close(transaction);
  }
}
