import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Income } from './income';

@Injectable()
export class IncomeService {
  entityName: String = 'incomes';
  incomesUrl: string;

  constructor(private db: AngularFireDatabase) {
    this.incomesUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll() {
    return this.db
      .list(this.incomesUrl)
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

  update(income: Income): Promise<void> {
    return this.db.list(this.incomesUrl).update(income.key, {
      amount: income.amount,
      category: income.category,
      isApplied: income.isApplied,
      notes: income.notes,
      subCategory: income.subCategory,
      toAccount: income.toAccount,
      date: income.date.toISOString(),
    });
  }

  create(income: Income) {
    this.db.list(this.incomesUrl).push({
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
    });
  }

  delete(income: Income): Promise<void> {
    return this.db.list(this.incomesUrl).remove(income.key);
  }
}
