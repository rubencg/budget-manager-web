import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction, TransactionTypes } from 'src/app/models';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction
  ) {}

  ngOnInit(): void {}

  getTypeName(type: TransactionTypes): string {
    switch (type) {
      case TransactionTypes.Income:
        return 'Ingreso';
      case TransactionTypes.Expense:
        return 'Gasto';
      case TransactionTypes.Transfer:
        return 'Transferencia';
      case TransactionTypes.MonthlyIncome:
        return 'Ingreso Mensual';
      case TransactionTypes.MonthlyExpense:
        return 'Gasto Mensual';
    }
  }
}
