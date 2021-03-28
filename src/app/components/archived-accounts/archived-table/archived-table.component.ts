import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Account, ArchivedAccountDataSource } from 'src/app/account';
import { AccountActions, AccountState, AccountStateModel } from 'src/app/state';

@Component({
  selector: 'archived-table',
  templateUrl: './archived-table.component.html',
  styleUrls: ['./archived-table.component.scss'],
})
export class ArchivedTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'balance', 'actions'];
  @Select(AccountState.selectArchivedAccounts) archivedAccounts$: Observable<Account[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Account>([]);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  constructor(public store: Store) {
    this.archivedAccounts$.subscribe(
      (state) => {
        console.log(state);
        
        this.dataSource = new MatTableDataSource<Account>(state);
      }
    )
  }

  ngOnInit(): void {}

  deleteArchivedAccount(account: Account){
    this.store.dispatch(new AccountActions.DeleteArchivedAccount(account));
  }

}
