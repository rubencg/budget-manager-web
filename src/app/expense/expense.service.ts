import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Expense } from './expense';

@Injectable()
export class ExpenseService {

  entityName: String = 'expenses';
  expensesUrl: string;

  constructor(private db: AngularFireDatabase) {
    this.expensesUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll() {
    return this.db
      .list(this.expensesUrl)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as Expense;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  create(expense: Expense) {
    this.db.list(this.expensesUrl).push(expense);
  }

  delete(expense: Expense): Promise<void> {
    return this.db.list(this.expensesUrl).remove(expense.key);
  }
  
}
