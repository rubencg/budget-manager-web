import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Transfer } from './transfer';

@Injectable()
export class TransferService {

  entityName: String = 'transfers';
  transferUrl: string;

  constructor(private db: AngularFireDatabase) { 
    this.transferUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll(){
    return this.db
      .list(this.transferUrl)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as Transfer;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  create(transfer: Transfer) {
    this.db.list(this.transferUrl).push({
      amount: transfer.amount,
      date: transfer.date.toISOString(),
      fromAccount: transfer.fromAccount,
      notes: transfer.notes,
      toAccount: transfer.toAccount
    });
  }

  delete(key: string): Promise<void> {
    return this.db.list(this.transferUrl).remove(key);
  }

  update(transfer: Transfer): Promise<void> {
    return this.db.list(this.transferUrl).update(transfer.key, {
      amount: transfer.amount,
      notes: transfer.notes,
      fromAccount: transfer.fromAccount,
      toAccount: transfer.toAccount,
      date: transfer.date.toISOString(),
    });
  }
}
