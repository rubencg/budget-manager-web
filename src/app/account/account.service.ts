import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Account } from './account';
import { AccountType } from './account-type';

@Injectable()
export class AccountService {
  entityName: String = 'accounts';
  typesEntityName: String = 'accountTypes';
  archiveEntityName: String = 'archivedAccounts';
  accountsUrl: string;
  accountTypesUrl: string;
  archivedAccountsUrl: string;

  constructor(private db: AngularFireDatabase) {
    this.accountsUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
    this.accountTypesUrl =
      'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.typesEntityName;
    this.archivedAccountsUrl =
      'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.archiveEntityName;
  }

  /* Starts Account */
  getAll() {
    return this.db
      .list(this.accountsUrl)
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

  updateAccount(account: Account): Promise<void> {
    return this.db.list(this.accountsUrl).update(account.key, {
      currentBalance: account.currentBalance,
      sumsToMonthlyBudget: account.sumsToMonthlyBudget,
      color: account.color,
      image: account.image,
      name: account.name,
      accountType: account.accountType,
    });
  }

  createNewAccount(account: Account) {
    this.db.list(this.accountsUrl).push(account);
  }

  deleteAccount(account: Account): Promise<void> {
    return this.db.list(this.accountsUrl).remove(account.key);
  }

  /* Ends Account */

  /* Starts AccountTypes */
  getAllTypes() {
    return this.db
      .list(this.accountTypesUrl)
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
  getAllArchivedAccounts() {
    return this.db
      .list(this.archivedAccountsUrl)
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

  createNewArchivedAccount(account: Account) {
    this.db.list(this.archivedAccountsUrl).push(account);
  }

  deleteArchivedAccount(account: Account): Promise<void> {
    return this.db.list(this.archivedAccountsUrl).remove(account.key);
  }
  /* Ends Archived Accounts */
}
