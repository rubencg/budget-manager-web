import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { AccountActions } from 'src/app/state';
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Created transfer', result);
      } else {
        console.log('Nothing was created');
      }
    });
  }

}
