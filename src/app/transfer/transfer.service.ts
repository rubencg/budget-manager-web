import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Transfer } from './transfer';

@Injectable()
export class TransferService {
  entityName: string = 'transfers';

  constructor(private db: AngularFireDatabase) { }

  getAll(uid: string){
    return this.db
      .list(`${uid}/${this.entityName}`)
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

  create(uid: string, transfer: Transfer) {
    let obj: any = {
      amount: transfer.amount,
      date: transfer.date.toISOString(),
      fromAccount: transfer.fromAccount,
      notes: transfer.notes,
      toAccount: transfer.toAccount
    };

    if (transfer.savingKey){
      obj = {
        ...obj,
        savingKey: transfer.savingKey,
      }
    }

    this.db.list(`${uid}/${this.entityName}`).push(obj);
  }

  delete(uid: string, key: string): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(key);
  }

  update(uid: string, transfer: Transfer): Promise<void> {
    let obj: any = {
      amount: transfer.amount,
      notes: transfer.notes,
      fromAccount: transfer.fromAccount,
      toAccount: transfer.toAccount,
      date: transfer.date.toISOString(),
    };

    if (transfer.savingKey){
      obj = {
        ...obj,
        savingKey: transfer.savingKey,
      }
    }

    return this.db.list(`${uid}/${this.entityName}`).update(transfer.key, obj);
  }
}
