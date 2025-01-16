import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Saving } from 'src/app/saving';
import {
  ConfirmationDialogComponent,
  SavingComponent,
  TransferComponent,
} from '../../transactions/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SavingActions } from 'src/app/state/expense/saving-actions';
import { Transfer } from 'src/app/transfer';
import { TransferActions } from 'src/app/state';
import { Transaction } from 'src/app/models';

@Component({
  selector: 'app-savings-component',
  templateUrl: './savings-component.component.html',
  styleUrls: ['./savings-component.component.scss'],
})
export class SavingsComponentComponent implements AfterViewInit, OnChanges {
  @Input() savings: Saving[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Saving>([]);
  displayedColumns: string[] = [
    'name',
    'amountPerMonth',
    'savedAmount',
    'goalAmount',
    'leftAmount',
    'actions',
  ];

  constructor(public dialog: MatDialog, public store: Store) {}

  ngAfterViewInit(): void {
    this.setDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['savings'] && changes['savings'].currentValue) {
      this.setDataSource();
    }
  }

  editSaving(saving: Saving): void {
    const savingDialogRef = this.dialog.open(SavingComponent, {
      data: saving,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    savingDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(new SavingActions.SaveSaving(result));
      }
    });
  }

  deleteSaving(saving: Saving): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: '¿Estás seguro de que deseas eliminar este ahorro?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(new SavingActions.DeleteSaving(saving));
      }
    });
  }

  createTransfer(saving: Saving) {
    const transfer = {
      savingKey: saving.key
    }
    const dialogRef = this.dialog.open(TransferComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      data: transfer,
    });

    dialogRef.afterClosed().subscribe((transaction: Transaction) => {
      if (transaction) {
        this.store.dispatch(
          new TransferActions.SaveTransferTransaction(transaction)
        );
      }
    });
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource<Saving>(this.savings);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
