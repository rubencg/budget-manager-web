import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTypes } from 'src/app/models';

@Component({
  selector: 'report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
})
export class ReportHeaderComponent implements OnInit {
  today: Date = new Date();
  dateToDisplay: Date;
  @Input() dateType: DateTypes;
  @Output() onDateChanged: EventEmitter<Date> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.dateToDisplay = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      1
    );
  }

  getDateFormat() {
    switch (this.dateType) {
      case DateTypes.Month:
        return 'MMMM yyyy';
      case DateTypes.Year:
        return 'yyyy';
    }
  }

  add() {
    switch (this.dateType) {
      case DateTypes.Month:
        this.dateToDisplay.setMonth(this.dateToDisplay.getMonth() + 1);
        break;
      case DateTypes.Year:
        this.dateToDisplay.setFullYear(this.dateToDisplay.getFullYear() + 1);
        break;
    }
    this.dateToDisplay = new Date(
      this.dateToDisplay.getFullYear(),
      this.dateToDisplay.getMonth(),
      1
    );
  }

  substract() {
    switch (this.dateType) {
      case DateTypes.Month:
        this.dateToDisplay.setMonth(this.dateToDisplay.getMonth() - 1);
        break;
      case DateTypes.Year:
        this.dateToDisplay.setFullYear(this.dateToDisplay.getFullYear() - 1);
        break;
    }
    this.dateToDisplay = new Date(
      this.dateToDisplay.getFullYear(),
      this.dateToDisplay.getMonth(),
      1
    );
    this.onDateChanged.emit(this.dateToDisplay);
  }
}
