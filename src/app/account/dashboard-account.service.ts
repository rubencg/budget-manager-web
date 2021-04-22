import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { DashboardAccount } from './dashboard-account';

@Injectable()
export class DashboardAccountService {
  entityName: String = 'dashboardAccounts';
  
  constructor(private db: AngularFireDatabase) {
  }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
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

  update(uid: string, account: DashboardAccount): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(account.key, {
      accountKey: account.accountKey,
      order: account.order,
    });
  }

  create(uid: string, account: DashboardAccount) {
    this.db.list(`${uid}/${this.entityName}`).push({
      accountKey: account.accountKey,
      order: account.order
    });
  }

  delete(uid: string, account: DashboardAccount): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(account.key);
  }

}
