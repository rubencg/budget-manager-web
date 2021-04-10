import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { MonthlyIncome } from './monthly-income';

@Injectable()
export class MonthlyIncomeService {
  entityName: String = 'monthlyIncomes';
  monthlyIncomesUrl: string;

  constructor(private db: AngularFireDatabase) {
    this.monthlyIncomesUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll() {
    return this.db
      .list(this.monthlyIncomesUrl)
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

  update(income: MonthlyIncome): Promise<void> {
    return this.db.list(this.monthlyIncomesUrl).update(income.key, {
      amount: income.amount,
      category: income.category,
      notes: income.notes,
      subCategory: income.subCategory,
      toAccount: income.toAccount,
      day: income.day,
    });
  }

  create(income: MonthlyIncome) {
    this.db.list(this.monthlyIncomesUrl).push({
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

  delete(key: string): Promise<void> {
    return this.db.list(this.monthlyIncomesUrl).remove(key);
  }
}
