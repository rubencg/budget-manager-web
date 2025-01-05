import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { PlannedExpense } from './planned-expense';

@Injectable()
export class PlannedExpenseService {

  entityName: string = 'plannedExpenses';

  constructor(private db: AngularFireDatabase) {
  }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as PlannedExpense;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(uid: string, plannedExpense: PlannedExpense): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(plannedExpense.key, {
      totalAmount: plannedExpense.totalAmount,
      remainingAmount: plannedExpense.remainingAmount,
      category: plannedExpense.category,
      subCategory: plannedExpense.subCategory,
    });
  }

  create(uid: string, plannedExpense: PlannedExpense) {
    return this.db.list(`${uid}/${this.entityName}`).push({
      totalAmount: plannedExpense.totalAmount,
      remainingAmount: plannedExpense.remainingAmount,
      category: plannedExpense.category,
      subCategory: plannedExpense.subCategory,
    });
  }

  delete(uid: string, key: string): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(key);
  }
  
}
