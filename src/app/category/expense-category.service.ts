import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Category } from './category';

@Injectable()
export class ExpenseCategoryService {
  entityName: string = 'expenseCategories';

  constructor(private db: AngularFireDatabase) {
  }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as Category;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(uid: string, category: Category): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(category.key, {
      color: category.color,
      image: category.image,
      name: category.name,
      subcategories: category.subcategories
    });
  }

  create(uid: string, category: Category) {
    this.db.list(`${uid}/${this.entityName}`).push({
      color: category.color,
      image: category.image,
      name: category.name,
      subcategories: category.subcategories
    });
  }

  delete(uid: string, category: Category): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(category.key);
  }

}
