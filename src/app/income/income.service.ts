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

  create(income: Income) {
    this.db.list(this.incomesUrl).push(income);
  }

  delete(income: Income): Promise<void> {
    return this.db.list(this.incomesUrl).remove(income.key);
  }
}
