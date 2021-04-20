import { Component, OnInit, ViewChild } from '@angular/core';
import { DateTypes } from 'src/app/models';
import { LinearReportComponent } from '../linear-report/linear-report.component';
import { PieReportComponent } from '../pie-report/pie-report.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  dateType: DateTypes = DateTypes.Month;
  @ViewChild(PieReportComponent) pieReport: PieReportComponent;
  @ViewChild(LinearReportComponent) linearReport: LinearReportComponent;

  constructor() { }

  ngOnInit(): void {
  
  }

  // ToDo: Call this if the inner report changes the type
  onDateTypeChanged(dateType: DateTypes){
    this.dateType = dateType;
  }

  onDateChanged(date: Date){
    if(this.pieReport){
      this.pieReport.changeDate(date);
    }
    if(this.linearReport){
      this.linearReport.changeDate(date);
    }
  }

}
