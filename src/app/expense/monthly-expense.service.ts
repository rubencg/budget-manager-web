import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { MonthlyExpense } from './monthly-expense';

@Injectable()
export class MonthlyExpenseService {
  entityName: string = 'monthlyExpenses';

  constructor(private db: AngularFireDatabase) { }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as MonthlyExpense;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(uid: string, expense: MonthlyExpense): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(expense.key, {
      amount: expense.amount,
      category: expense.category,
      notes: expense.notes,
      subCategory: expense.subCategory,
      fromAccount: expense.fromAccount,
      day: expense.day,
    });
  }

  create(uid: string, expense: MonthlyExpense) {
    this.db.list(`${uid}/${this.entityName}`).push({
      amount: expense.amount,
      category: {
        image: expense.category.image,
        name: expense.category.name,
        color: expense.category.color,
        subcategories: expense.category.subcategories
      },
      day: expense.day,
      notes: expense.notes,
      subCategory: expense.subCategory,
      fromAccount: expense.fromAccount,
    });
  }

  delete(uid: string, key: string): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(key);
  }
}
