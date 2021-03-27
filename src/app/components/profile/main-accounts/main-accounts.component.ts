import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutocompleteElement } from 'src/app/models';

@Component({
  selector: 'main-accounts',
  templateUrl: './main-accounts.component.html',
  styleUrls: ['./main-accounts.component.scss']
})
export class MainAccountsComponent implements OnInit {

  filteredAccountsOne: Observable<AutocompleteElement[]>;
  filteredAccountsTwo: Observable<AutocompleteElement[]>;
  filteredAccountsThree: Observable<AutocompleteElement[]>;
  accounts: AutocompleteElement[] = [
    {
      name: 'Efectivo Ruben',
    },
    {
      name: 'Debito Sarahi',
    },
    {
      name: 'Ruben Banamex Credito',
    },
    {
      name: 'Ruben Ahorros',
    },
    {
      name: 'Sarahi Ahorros',
    },
  ];

  constructor() { 
    this.filteredAccountsOne = this.accountOneCtrl.valueChanges.pipe(
      startWith(''),
      map((account) =>
        account ? this._filterElements(account, this.accounts) : this.accounts.slice()
      )
    );
    this.filteredAccountsTwo = this.accountTwoCtrl.valueChanges.pipe(
      startWith(''),
      map((account) =>
        account ? this._filterElements(account, this.accounts) : this.accounts.slice()
      )
    );
    this.filteredAccountsThree = this.accountThreeCtrl.valueChanges.pipe(
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

  accountOneCtrl: FormControl = new FormControl('', []);
  accountTwoCtrl: FormControl = new FormControl('', []);
  accountThreeCtrl: FormControl = new FormControl('', []);
  form: FormGroup = new FormGroup({
    accountOne: this.accountOneCtrl,
    accountTwo: this.accountTwoCtrl,
    accountThree: this.accountThreeCtrl
  });

  ngOnInit(): void {
    this.form.patchValue({
      accountOne: this.accounts[0].name,
      accountTwo: this.accounts[1].name,
      accountThree: this.accounts[2].name,
    })
  }

}
