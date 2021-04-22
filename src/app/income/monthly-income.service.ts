import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { MonthlyIncome } from './monthly-income';

@Injectable()
export class MonthlyIncomeService {
  entityName: string = 'monthlyIncomes';

  constructor(private db: AngularFireDatabase) { }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as MonthlyIncome;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(uid: string, income: MonthlyIncome): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(income.key, {
      amount: income.amount,
      category: income.category,
      notes: income.notes,
      subCategory: income.subCategory,
      toAccount: income.toAccount,
      day: income.day,
    });
  }

  create(uid: string, income: MonthlyIncome) {
    this.db.list(`${uid}/${this.entityName}`).push({
      amount: income.amount,
      category: {
        image: income.category.image,
        name: income.category.name,
        color: income.category.color,
        subcategories: income.category.subcategories
      },
      day: income.day,
      notes: income.notes,
      subCategory: income.subCategory,
      toAccount: income.toAccount,
    });
  }

  delete(uid: string, key: string): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(key);
  }
}
