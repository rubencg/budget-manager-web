import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutocompleteElement } from 'src/app/models';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<IncomeComponent>) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(''),
      map((category) =>
        category ? this._filterElements(category, this.categories) : this.categories.slice()
      )
    );
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
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

  color: ThemePalette = 'warn';

  filteredCategories: Observable<AutocompleteElement[]>;
  categories: AutocompleteElement[] = [
    {
      image: 'hamburger',
      color: '#32a852',
      name: 'Comida',
    },
    {
      image: 'tshirt',
      color: '#328ba8',
      name: 'Ropa',
    },
    {
      image: 'book',
      color: '#c4412f',
      name: 'Educacion',
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
  categoryCtrl = new FormControl('',[
    Validators.required
  ]);
  accountCtrl = new FormControl('',[
    Validators.required
  ]);
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(),[
      Validators.required
    ]),
    category: this.categoryCtrl,
    account: this.accountCtrl,
    applied: new FormControl(true),
    amount: new FormControl('', [
      Validators.required
    ]),
    notes: new FormControl('')
  });
}
