import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Account } from 'src/app/account';
import { AccountGroup } from 'src/app/models';
import { AccountActions, AccountState, AccountStateModel } from 'src/app/state';
import { AccountDialogComponent, ArchiveAccountComponent } from '../dialogs';

@Component({
  selector: 'accounts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  

  @Select(AccountState.selectAccountGroups) accountGroups$: Observable<AccountStateModel>;
  constructor(public dialog: MatDialog, public store: Store) { }

  ngOnInit(): void {
  }

  editAccount(account: Account){
    const accountDialogRef = this.dialog.open(AccountDialogComponent, {
      data: account,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      autoFocus: false
    });
    accountDialogRef.afterClosed().subscribe((editedAccount: Account) => {
      if (editedAccount) {
        editedAccount.key = account.key;
        this.store.dispatch(new AccountActions.SaveAccount(editedAccount));
      }
    });
  }

  archiveAccount(account: Account){
    const archiveAccountDialogRef = this.dialog.open(ArchiveAccountComponent, {
      data: account,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      autoFocus: false
    });
    archiveAccountDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(new AccountActions.ArchiveAccount(account));
      }
    });
  }
  
}
