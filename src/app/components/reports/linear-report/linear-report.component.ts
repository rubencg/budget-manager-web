import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'linear-report',
  templateUrl: './linear-report.component.html',
  styleUrls: ['./linear-report.component.scss']
})
export class LinearReportComponent implements OnInit {
  @Input() currentDate: Date;

  constructor() { }

  ngOnInit(): void {
    
  }

}
