import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-available-per-day',
  templateUrl: './available-per-day.component.html',
  styleUrls: ['./available-per-day.component.scss'],
})
export class AvailablePerDayComponent implements OnInit, OnChanges {
  @Input() availableAmount: number;
  availablePerDay: number;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['availableAmount'] && changes['availableAmount'].currentValue){
      this.availableAmount = changes['availableAmount'].currentValue;
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.availablePerDay = this.availableAmount / this.daysRemainingInMonth();
  }

  private daysRemainingInMonth(): number {
    const today = new Date(); // Fecha actual
    const year = today.getFullYear();
    const month = today.getMonth(); // Mes actual (0 = Enero, 11 = Diciembre)

    // Último día del mes actual
    const lastDayOfMonth = new Date(year, month + 1, 0); // Día 0 del siguiente mes = último día del mes actual

    // Calcular la diferencia en días (incluyendo hoy)
    const remainingDays = lastDayOfMonth.getDate() - today.getDate() + 1;

    return remainingDays;
  }
}
