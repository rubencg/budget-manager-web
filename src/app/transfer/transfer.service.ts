import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Transfer } from './transfer';

@Injectable()
export class TransferService {

  entityName: String = 'transfers';
  transferUrl: string;

  constructor(private db: AngularFireDatabase) { 
    this.transferUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll(){
    return this.db.list(this.transferUrl).valueChanges();
  }

  createNewTransfer(transfer: Transfer) {
    this.db.list(this.transferUrl).push(transfer);
  }

  deleteTransfer(transfer: Transfer): Promise<void> {
    return this.db.list(this.transferUrl).remove(transfer.key);
  }
}
