import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Expense } from './expense';

@Injectable()
export class ExpenseService {

  entityName: string = 'expenses';

  constructor(private db: AngularFireDatabase) {
  }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
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

  update(uid: string, expense: Expense): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(expense.key, {
      amount: expense.amount,
      category: expense.category,
      isApplied: expense.isApplied,
      notes: expense.notes,
      subCategory: expense.subCategory,
      fromAccount: expense.fromAccount,
      date: expense.date.toISOString(),
    });
  }

  create(uid: string, expense: Expense) {
    return this.db.list(`${uid}/${this.entityName}`).push({
      amount: expense.amount,
      category: {
        image: expense.category.image,
        name: expense.category.name,
        color: expense.category.color,
        subcategories: expense.category.subcategories
      },
      date: expense.date.toISOString(),
      isApplied: expense.isApplied,
      notes: expense.notes,
      subCategory: expense.subCategory,
      fromAccount: expense.fromAccount,
      monthlyKey: expense.monthlyKey
    });
  }

  delete(uid: string, key: string): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(key);
  }
  
}
