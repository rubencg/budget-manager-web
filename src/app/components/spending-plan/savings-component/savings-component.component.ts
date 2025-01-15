import { Component, Input, OnInit } from '@angular/core';
import { Saving } from 'src/app/saving';

@Component({
  selector: 'app-savings-component',
  templateUrl: './savings-component.component.html',
  styleUrls: ['./savings-component.component.scss'],
})
export class SavingsComponentComponent implements OnInit {
  @Input() savings: Saving[];

  constructor() {}

  ngOnInit(): void {}
}
