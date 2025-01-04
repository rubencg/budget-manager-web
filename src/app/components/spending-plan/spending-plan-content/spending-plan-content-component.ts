import { Component } from '@angular/core';

@Component({
  selector: 'app-spending-plan-content',
  templateUrl: './spending-plan-content-component.html',
  styleUrls: ['./spending-plan-content-component.scss'],
})
export class SpendingPlanContentComponent {
  plannedIncome: number = 0;
  plannedExpense: number = 0;
  selectedSection: string = 'income'; // Variable para controlar el contenido

  selectSection(section: string) {
    this.selectedSection = section; // Cambia el contenido mostrado
  }

  updatePlannedIncomesSum(newPlannedIncome: number): void {
    this.plannedIncome = newPlannedIncome;
  }

  updatePlannedExpensesSum(newPlannedExpense: number): void {
    this.plannedExpense = newPlannedExpense;
  }
}
