import { Component, OnInit, ViewChild } from '@angular/core';
import { DateTypes } from 'src/app/models';
import { PieReportComponent } from '../pie-report/pie-report.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  dateType: DateTypes = DateTypes.Month;
  currentDate: Date = new Date();
  @ViewChild(PieReportComponent) pieReport: PieReportComponent;

  constructor() { }

  ngOnInit(): void {
  
  }

  // ToDo: Call this if the inner report changes the type
  onDateTypeChanged(dateType: DateTypes){
    this.dateType = dateType;
  }

  onDateChanged(date: Date){
    this.currentDate = date;
    this.pieReport.changeDate(date);
  }

}
