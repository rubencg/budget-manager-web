import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { from, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Account } from 'src/app/account';
import { Category } from 'src/app/category';
import { AutocompleteElement, Transaction, TransactionTypes } from 'src/app/models';
import { AccountState, CategoryState } from 'src/app/state';

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
      map((value) => (typeof value === 'string' ? value : value.name)),
      switchMap((val) => this._filterCategoryElements(val))
    );
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      switchMap((val) => this._filterAccountElements(val))
    );
    this.filteredSubcategories = this.subcategoryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSubcategoryElements(value))
    );
  }

  private _filterSubcategoryElements(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.subcategories.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterCategoryElements(value: string): Observable<Category[]> {
    return this.categories$.pipe(
      map((response) => {
        return value
          ? response.filter((account) =>
              account.name.toLowerCase().includes(value.toLowerCase())
            )
          : response;
      })
    );
  }

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

  displayFn(element) {
    return element ? element.name : '';
  }

  displayAccountFn(account: Account) {
    return account ? account.name : '';
  }

  ngOnInit(): void {
    this.title = 'Nuevo ingreso';
    if(this.data != undefined && this.data != null){
      this.title = 'Editar ingreso';
      this.showMoreEnabled = false;
      this.form.get('applied').disable();

      let transaction: Transaction = this.data;
      
      this.setSubcategories(transaction.category);
      
      this.form.patchValue({
        amount: transaction.amount,
        date: transaction.date,
        notes: transaction.notes,
        subcategory: transaction.subcategory,
        category: transaction.category,
        account: transaction.account,
        applied: transaction.applied,
      })
    }
  }

  categorySelected(event: MatAutocompleteSelectedEvent){
    const category: Category = event.option.value;
    this.subcategoryCtrl.patchValue('');
    this.setSubcategories(category);
  }
  
  setSubcategories(category: Category){
    if(category.subcategories){
      this.subcategories =  category.subcategories;
      this.subcategoryCtrl.enable();
    }else{
      this.subcategories = [];
      this.subcategoryCtrl.disable();
    }
  }

  filteredSubcategories: Observable<string[]>;
  subcategories: string[] = [];

  filteredCategories: Observable<Category[]>;
  @Select(CategoryState.selectIncomeCategories) categories$: Observable<Category[]>;

  @Select(AccountState.selectAccounts) accounts$: Observable<Account[]>;
  filteredAccounts: Observable<Account[]>;

  // Form Controls
  categoryCtrl = new FormControl('', [Validators.required]);
  subcategoryCtrl = new FormControl('');
  accountCtrl = new FormControl('', [Validators.required]);
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    category: this.categoryCtrl,
    account: this.accountCtrl,
    applied: new FormControl(true),
    amount: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    subcategory: this.subcategoryCtrl,
    monthlyRecurrent: new FormControl(''),
    repeat: new FormControl(false),
    times: new FormControl(''),
    recurrence: new FormControl(''),
  });

  save(){
    let transaction: Transaction = {
      amount: this.form.get('amount').value,
      type: TransactionTypes.Income,
      date: this.form.get('date').value,
      account: this.form.get('account').value,
      category: this.form.get('category').value,
      subcategory: this.form.get('subcategory').value,
      notes: this.form.get('notes').value,
      applied: this.form.get('applied').value,
      key: this.data ? this.data.key : undefined,
      isMonthly: this.form.get('monthlyRecurrent').value,
    }

    this.dialogRef.close(transaction);
  }
}
