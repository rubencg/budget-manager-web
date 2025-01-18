import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Account } from 'src/app/account';
import { Category } from 'src/app/category';
import { MonthlyExpense } from 'src/app/expense';
import { Transaction } from 'src/app/models';
import { AccountState, CategoryState } from 'src/app/state';

@Component({
  selector: 'app-monthly-expense',
  templateUrl: './monthly-expense.component.html',
  styleUrls: ['./monthly-expense.component.scss'],
})
export class MonthlyExpenseComponent implements OnInit {
  title: String;

  constructor(
    public dialogRef: MatDialogRef<MonthlyExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction
  ) {
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
      map((value) => this._filterSubcategoryElements(value))
    );
  }

  ngOnInit(): void {
    if (this.data != undefined && this.data != null) {      
      this.title = 'Editar gasto mensual';
      const date = new Date();
      
      this.setSubcategories(this.data.category);
      this.form.patchValue({
        amount: this.data.amount,
        date: new Date(
          date.getFullYear(),
          date.getMonth(),
          this.data.date.getDate()
        ),
        notes: this.data.notes,
        category: this.data.category,
        account: this.data.account,
        subcategory: this.data.subcategory,
      });
    }
  }

  private _filterSubcategoryElements(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.subcategories.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
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

  categorySelected(event: MatAutocompleteSelectedEvent) {
    const category: Category = event.option.value;
    this.subcategoryCtrl.patchValue('');
    this.setSubcategories(category);
  }

  setSubcategories(category: Category) {
    if (category.subcategories) {
      this.subcategories = category.subcategories;
      this.subcategoryCtrl.enable();
    } else {
      this.subcategories = [];
      this.subcategoryCtrl.disable();
    }
  }

  filteredSubcategories: Observable<string[]>;
  subcategories: string[] = [];

  filteredCategories: Observable<Category[]>;
  @Select(CategoryState.selectExpenseCategories) categories$: Observable<
    Category[]
  >;

  @Select(AccountState.selectAccounts) accounts$: Observable<Account[]>;
  filteredAccounts: Observable<Account[]>;

  // Form Controls
  categoryCtrl = new FormControl('', [Validators.required]);
  accountCtrl = new FormControl('', [Validators.required]);
  subcategoryCtrl = new FormControl('');
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    category: this.categoryCtrl,
    subcategory: this.subcategoryCtrl,
    account: this.accountCtrl,
    amount: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  save() {
    let monthlyExpense: MonthlyExpense = {
      amount: this.form.get('amount').value,
      day: this.form.get('date').value.getDate(),
      fromAccount: this.form.get('account').value,
      category: this.form.get('category').value,
      subCategory: this.form.get('subcategory').value,
      notes: this.form.get('notes').value,
      key: this.data ? this.data.key : undefined,
    };

    this.dialogRef.close(monthlyExpense);
  }
}
