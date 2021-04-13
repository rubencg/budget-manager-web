import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RecurringTypes } from 'src/app/models';

@Component({
  selector: 'show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.scss']
})
export class ShowMoreComponent implements OnInit {

  @Input() parentForm: FormGroup;
  showAdditionalData: Boolean = false;
  recurrences = [
    { value: RecurringTypes.Days, viewValue: 'Dias' },
    { value: RecurringTypes.Weeks, viewValue: 'Semanas' },
    { value: RecurringTypes.Months, viewValue: 'Meses' },
    { value: RecurringTypes.Years, viewValue: 'Años' },
  ];
  

  constructor() { }

  ngOnInit(): void {
    this.parentForm.patchValue({
      recurrence: RecurringTypes.Months,
      times: 3
    });

    this.parentForm.get('times').disable();
    this.parentForm.get('recurrence').disable();
  }

  monthlyRecurrenceChanged() {
    this.parentForm.get('repeat').patchValue(false);
    this.enableRecurrenceControls(false);
  }
  
  repeatChanged($event) {
    this.parentForm.get('monthlyRecurrent').patchValue(false);
    this.enableRecurrenceControls($event.checked);
  }

  private enableRecurrenceControls(enable: Boolean){
    let timesCtrl = this.parentForm.get('times');
    let recurrenceCtrl = this.parentForm.get('recurrence');

    if (enable) {
      timesCtrl.enable();
      recurrenceCtrl.enable();
    } else {
      timesCtrl.disable();
      recurrenceCtrl.disable();
    }
  }

}
