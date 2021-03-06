import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Account } from './account';
import { AccountType } from './account-type';

@Injectable()
export class AccountService {
  entityName: string = 'accounts';
  typesEntityName: string = 'accountTypes';
  archiveEntityName: string = 'archivedAccounts';

  constructor(private db: AngularFireDatabase) { }

  /* Starts Account */
  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as Account;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(uid: string, account: Account): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(account.key, {
      currentBalance: account.currentBalance,
      sumsToMonthlyBudget: account.sumsToMonthlyBudget,
      color: account.color,
      image: account.image,
      name: account.name,
      accountType: account.accountType,
    });
  }

  create(uid: string, account: Account) {
    this.db.list(`${uid}/${this.entityName}`).push({
      name: account.name,
      accountType: account.accountType,
      color: account.color,
      currentBalance: account.currentBalance,
      image: account.image,
      sumsToMonthlyBudget: account.sumsToMonthlyBudget,
    });
  }

  delete(uid: string, account: Account): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(account.key);
  }

  /* Ends Account */

  /* Starts AccountTypes */
  getAllTypes(uid: string) {
    return this.db
      .list(`${uid}/${this.typesEntityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as AccountType;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  /* Ends AccountTypes */

  /* Starts Archived Accounts */
  getAllArchivedAccounts(uid: string) {
    return this.db
      .list(`${uid}/${this.archiveEntityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as Account;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  createNewArchivedAccount(uid: string, account: Account) {
    this.db.list(`${uid}/${this.archiveEntityName}`).push({
      name: account.name,
      accountType: account.accountType,
      color: account.color,
      currentBalance: account.currentBalance,
      image: account.image,
      sumsToMonthlyBudget: account.sumsToMonthlyBudget,
    });
  }

  deleteArchivedAccount(uid: string, account: Account): Promise<void> {
    return this.db.list(`${uid}/${this.archiveEntityName}`).remove(account.key);
  }
  /* Ends Archived Accounts */
}
