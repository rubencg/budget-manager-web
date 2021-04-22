import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Income } from './income';

@Injectable()
export class IncomeService {
  entityName: string = 'incomes';

  constructor(private db: AngularFireDatabase) {
  }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as Income;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(uid: string, income: Income): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(income.key, {
      amount: income.amount,
      category: income.category,
      isApplied: income.isApplied,
      notes: income.notes,
      subCategory: income.subCategory,
      toAccount: income.toAccount,
      date: income.date.toISOString(),
    });
  }

  create(uid: string, income: Income) {
    return this.db.list(`${uid}/${this.entityName}`).push({
      amount: income.amount,
      category: {
        image: income.category.image,
        name: income.category.name,
        color: income.category.color,
        subcategories: income.category.subcategories
      },
      date: income.date.toISOString(),
      isApplied: income.isApplied,
      notes: income.notes,
      subCategory: income.subCategory,
      toAccount: income.toAccount,
      monthlyKey: income.monthlyKey
    });
  }

  delete(uid: string, key: string): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(key);
  }
}
