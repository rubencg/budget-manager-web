import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'change-info',
  templateUrl: './change-info.component.html',
  styleUrls: ['./change-info.component.scss']
})
export class ChangeInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  form: FormGroup = new FormGroup({
    name: new FormControl('Ruben Cardenas', [Validators.required])
  });

}
