import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AutocompleteElement, Filter, TransactionTypes } from 'src/app/models';
import { AccountState, CategoryState } from 'src/app/state';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FiltersComponent>,
    private activatedRoute: ActivatedRoute) {
  }

  todaysDate = new Date();

  @Select(CategoryState.selectAllCategories) categories$: Observable<Account[]>;
  @Select(AccountState.selectAccounts) accounts$: Observable<Account[]>;
  types: TransactionTypes[] = [
    TransactionTypes.Expense,
    TransactionTypes.Income,
    TransactionTypes.Transfer,
    TransactionTypes.MonthlyExpense,
    TransactionTypes.MonthlyIncome
  ]

  getTypeName(type: TransactionTypes): string {
    switch (type) {
      case TransactionTypes.Income:
        return 'Ingreso';
      case TransactionTypes.Expense:
        return 'Gasto';
      case TransactionTypes.Transfer:
        return 'Transferencia';
      case TransactionTypes.MonthlyIncome:
        return 'Ingreso Mensual';
      case TransactionTypes.MonthlyExpense:
        return 'Gasto Mensual';
    }
  }

  // Form Controls
  categoryCtrl = new FormControl('');
  accountCtrl = new FormControl('');
  form: FormGroup = new FormGroup({
    startDate: new FormControl(new Date(this.todaysDate.getFullYear(), this.todaysDate.getMonth(), 1),[
      Validators.required
    ]),
    endDate: new FormControl(new Date(this.todaysDate.getFullYear(), this.todaysDate.getMonth() + 1, 0),[
      Validators.required
    ]),
    categories: this.categoryCtrl,
    accounts: this.accountCtrl,
    types: new FormControl(''),
  });

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['startDate']){
        let startDate = new Date(params['startDate']);
        this.form.patchValue({
          startDate: startDate
        });
      }
      if(params['endDate']){
        let endDate = new Date(params['endDate']);
        this.form.patchValue({
          endDate: endDate
        });
      }
      // this.category = params['category'];
      // this.account = params['account'];
    });
  }

  filter(){
    let filter: Filter = {
      startDate: this.form.get('startDate').value.toISOString(),
      endDate: this.form.get('endDate').value.toISOString(),
      categories: this.categoryCtrl.value,
      accounts: this.accountCtrl.value,
      types: this.form.get('types').value
    }

    this.dialogRef.close(filter);
  }

  unFilter(){
    this.dialogRef.close({
      clearFilters: true
    });
  }

}
