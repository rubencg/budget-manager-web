import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { DashboardAccount } from './dashboard-account';

@Injectable()
export class DashboardAccountService {
  entityName: String = 'dashboardAccounts';
  dashboardAccountsUrl: string;
  
  constructor(private db: AngularFireDatabase) {
    this.dashboardAccountsUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll() {
    return this.db
      .list(this.dashboardAccountsUrl)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as DashboardAccount;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(account: DashboardAccount): Promise<void> {
    return this.db.list(this.dashboardAccountsUrl).update(account.key, {
      accountKey: account.accountKey,
      order: account.order,
    });
  }

  create(account: DashboardAccount) {
    this.db.list(this.dashboardAccountsUrl).push({
      accountKey: account.accountKey,
      order: account.order
    });
  }

  delete(account: DashboardAccount): Promise<void> {
    return this.db.list(this.dashboardAccountsUrl).remove(account.key);
  }

}
