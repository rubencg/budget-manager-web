import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Category } from 'src/app/category';
import { PlannedExpense } from 'src/app/planned-expense';
import { CategoryState } from 'src/app/state';

@Component({
  selector: 'app-planned-expense',
  templateUrl: './planned-expense.component.html',
  styleUrls: ['./planned-expense.component.scss'],
})
export class PlannedExpenseComponent implements OnInit {
  title: String;
  subcategories: string[] = [];
  filteredSubcategories: Observable<string[]>;
  filteredCategories: Observable<Category[]>;
  @Select(CategoryState.selectExpenseCategories) categories$: Observable<
    Category[]
  >;

  constructor(
    public dialogRef: MatDialogRef<PlannedExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlannedExpense
  ) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      switchMap((val) => this._filterCategoryElements(val))
    );
    this.filteredSubcategories = this.subcategoryCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSubcategoryElements(value))
    );
  }

  ngOnInit(): void {
    this.title = 'Nuevo gasto planeado';
    if (this.data != undefined && this.data != null){
      this.title = 'Editar gasto planeado';
      
      this.form.patchValue({
        name: this.data.name,
        date: this.data.date,
        isRecurring: this.data.isRecurring,
        amount: Math.abs(this.data.totalAmount),
        category: this.data.category,
        subcategory: this.data.subCategory,
      })
    }
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

  private _filterSubcategoryElements(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.subcategories.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
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

  displayFn(element) {
    return element ? element.name : '';
  }
  
  // Form Controls
  categoryCtrl = new FormControl('', [Validators.required]);
  subcategoryCtrl = new FormControl('');
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    date: new FormControl(new Date(),[
      Validators.required
    ]),
    isRecurring: new FormControl(false),
    amount: new FormControl('', [Validators.required]),
    category: this.categoryCtrl,
    subcategory: this.subcategoryCtrl,
  });

  save() {
    let plannedExpense: PlannedExpense = {
      totalAmount: this.form.get('amount').value,
      name: this.form.get('name').value,
      date: this.form.get('date').value,
      isRecurring: this.form.get('isRecurring').value,
      category: this.form.get('category').value,
      subCategory: this.form.get('subcategory').value,
      key: this.data ? this.data.key : undefined,
    };

    this.dialogRef.close(plannedExpense);
  }
}
