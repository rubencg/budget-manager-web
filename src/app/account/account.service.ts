import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class AccountService {

  entityName: String = 'accounts';

  constructor(private db: AngularFireDatabase) { }

  getAll(){
    return this.db.list('axEUkilpFOrtiMnLEaTSHBHmeGEx/'+this.entityName).valueChanges();
  }
}
