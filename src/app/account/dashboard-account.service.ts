import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { DashboardAccount } from './dashboard-account';

@Injectable()
export class DashboardAccountService {
  entityName: String = 'dashboardAccounts';
  
  constructor(private db: AngularFireDatabase) {
  }

  getAll(uId: string) {
    return this.db
      .list(`${uId}/${this.entityName}`)
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

  update(uId: string, account: DashboardAccount): Promise<void> {
    return this.db.list(`${uId}/${this.entityName}`).update(account.key, {
      accountKey: account.accountKey,
      order: account.order,
    });
  }

  create(uId: string, account: DashboardAccount) {
    this.db.list(`${uId}/${this.entityName}`).push({
      accountKey: account.accountKey,
      order: account.order
    });
  }

  delete(uId: string, account: DashboardAccount): Promise<void> {
    return this.db.list(`${uId}/${this.entityName}`).remove(account.key);
  }

}
