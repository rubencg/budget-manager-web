import { Component, OnInit } from '@angular/core';
import { DateTypes } from 'src/app/models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  dateType: DateTypes = DateTypes.Month;

  constructor() { }

  ngOnInit(): void {
  }

  // ToDo: Call this if the inner report changes the type
  onDateTypeChanged(dateType: DateTypes){
    this.dateType = dateType;
  }

}
