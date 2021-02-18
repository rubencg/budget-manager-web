import { Component, OnInit } from '@angular/core';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'budget-calendar',
  templateUrl: './budget-calendar.component.html',
  styleUrls: ['./budget-calendar.component.scss'],
})
export class BudgetCalendarComponent implements OnInit {
  constructor() {}

  rightArrow = faChevronRight;
  leftArrow = faChevronLeft;

  ngOnInit(): void {}

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('logged', date);
  }
}
