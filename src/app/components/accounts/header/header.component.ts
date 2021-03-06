import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Transaction } from 'src/app/models';
import { AccountActions, TransferActions } from 'src/app/state';
import { TransferComponent } from '../../transactions/dialogs';
import { AccountDialogComponent } from '../dialogs';

@Component({
  selector: 'accounts-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AccountsHeaderComponent implements OnInit {

  constructor(public dialog: MatDialog, public store: Store) { }

  ngOnInit(): void {
  }

  createAccountDialog() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((newAccount) => {
      if (newAccount) {
        this.store.dispatch(new AccountActions.SaveAccount(newAccount));
      }
    });
  }

  createTransferDialog() {
    const dialogRef = this.dialog.open(TransferComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((transaction: Transaction) => {
      if (transaction) {
        this.store.dispatch(new TransferActions.SaveTransferTransaction(transaction));
      }
    });
  }

}
