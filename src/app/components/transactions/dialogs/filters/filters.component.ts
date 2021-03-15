import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AutocompleteElement, Filter } from 'src/app/models';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FiltersComponent>) {
  }

  todaysDate = new Date();
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
    accounts: this.accountCtrl
  });

  ngOnInit(): void {
    
  }

  filter(){
    let filter: Filter = {
      startDate: this.form.get('startDate').value,
      endDate: this.form.get('endDate').value,
      categories: this.categoryCtrl.value,
      accounts: this.accountCtrl.value
    }

    this.dialogRef.close(filter);
  }

}
