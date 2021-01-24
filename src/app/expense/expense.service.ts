import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  entityName: String = 'expenses';

  constructor(private db: AngularFireDatabase) { }

  getAll(){
    return this.db.list('6RkLgHmOPddFhASQgZSrbS1bMCa2/'+this.entityName).valueChanges();
  }
  
}
