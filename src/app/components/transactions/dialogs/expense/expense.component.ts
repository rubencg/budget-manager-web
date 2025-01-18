import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Category } from 'src/app/category';
import { Transaction, TransactionTypes } from 'src/app/models';
import { AccountState, CategoryState } from 'src/app/state';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  showMoreEnabled: Boolean = true;
  title: String;

  constructor(public dialogRef: MatDialogRef<ExpenseComponent>, 
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
    this.title = 'Nuevo gasto';
    if(this.data != undefined && this.data != null){
      this.showMoreEnabled = false;
      this.form.get('applied').disable();
      let transaction: Transaction = this.data;
      this.setSubcategories(transaction.category);

      if(this.data.key){
        this.title = 'Editar gasto';

        this.form.patchValue({
          amount: transaction.amount,
          date: transaction.date,
          notes: transaction.notes,
          category: transaction.category,
          account: transaction.account,
          applied: transaction.applied,
          subcategory: transaction.subcategory,
          removeFromSpendingPlan: transaction.removeFromSpendingPlan,
        })
      } else {
        this.title = 'Crear gasto de planeado';
        
        this.form.patchValue({
          amount: transaction.amount,
          date: transaction.date,
          category: transaction.category,
          subcategory: transaction.subcategory,
        })
      }
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
  @Select(CategoryState.selectExpenseCategories) categories$: Observable<Category[]>;

  @Select(AccountState.selectAccounts) accounts$: Observable<Account[]>;
  filteredAccounts: Observable<Account[]>;

  // Form Controls
  categoryCtrl = new FormControl('',[
    Validators.required
  ]);
  accountCtrl = new FormControl('',[
    Validators.required
  ]);
  subcategoryCtrl = new FormControl('');
  form: FormGroup = new FormGroup({
    date: new FormControl(new Date(),[
      Validators.required
    ]),
    category: this.categoryCtrl,
    subcategory: this.subcategoryCtrl,
    account: this.accountCtrl,
    applied: new FormControl(true),
    removeFromSpendingPlan: new FormControl(false),
    amount: new FormControl('', [
      Validators.required
    ]),
    notes: new FormControl(''),
    monthlyRecurrent: new FormControl(''),
    repeat: new FormControl(false),
    times: new FormControl(''),
    recurrence: new FormControl(''),
  });

  save(){
    let transaction: Transaction = {
      amount: this.form.get('amount').value,
      type: TransactionTypes.Expense,
      date: this.form.get('date').value,
      account: this.form.get('account').value,
      category: this.form.get('category').value,
      subcategory: this.form.get('subcategory').value,
      notes: this.form.get('notes').value,
      applied: this.form.get('applied').value,
      key: this.data ? this.data.key : undefined,
      isMonthly: this.form.get('monthlyRecurrent').value,
      isRecurring: this.form.get('repeat').value,
      recurringTimes: this.form.get('times').value,
      recurringType: this.form.get('recurrence').value,
      removeFromSpendingPlan: this.form.get('removeFromSpendingPlan').value,
    }

    this.dialogRef.close(transaction);
  }
}
