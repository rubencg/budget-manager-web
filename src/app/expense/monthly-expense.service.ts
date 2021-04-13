import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { MonthlyExpense } from './monthly-expense';

@Injectable()
export class MonthlyExpenseService {
  entityName: String = 'monthlyExpenses';
  monthlyExpensesUrl: string;

  constructor(private db: AngularFireDatabase) {
    this.monthlyExpensesUrl = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll() {
    return this.db
      .list(this.monthlyExpensesUrl)
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

  update(expense: MonthlyExpense): Promise<void> {
    return this.db.list(this.monthlyExpensesUrl).update(expense.key, {
      amount: expense.amount,
      category: expense.category,
      notes: expense.notes,
      subCategory: expense.subCategory,
      fromAccount: expense.fromAccount,
      day: expense.day,
    });
  }

  create(expense: MonthlyExpense) {
    this.db.list(this.monthlyExpensesUrl).push({
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

  delete(key: string): Promise<void> {
    return this.db.list(this.monthlyExpensesUrl).remove(key);
  }
}
