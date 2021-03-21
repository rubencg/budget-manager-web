import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransferComponent } from '../../transactions/dialogs';
import { AccountDialogComponent } from '../dialogs';

@Component({
  selector: 'accounts-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AccountsHeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  createAccountDialog() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Created account', result);
      } else {
        console.log('Nothing was created');
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
