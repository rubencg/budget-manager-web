import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Category } from './category';

@Injectable()
export class ExpenseCategoryService {
  entityName: String = 'expenseCategories';
  url: string;

  constructor(private db: AngularFireDatabase) {
    this.url = 'axEUkilpFOrtiMnLEaTSHBHmeGEx/' + this.entityName;
  }

  getAll() {
    return this.db
      .list(this.url)
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

  update(category: Category): Promise<void> {
    return this.db.list(this.url).update(category.key, {
      color: category.color,
      image: category.image,
      name: category.name,
      subcategories: category.subcategories
    });
  }

  create(category: Category) {
    this.db.list(this.url).push({
      color: category.color,
      image: category.image,
      name: category.name,
      subcategories: category.subcategories
    });
  }

  delete(category: Category): Promise<void> {
    return this.db.list(this.url).remove(category.key);
  }

}
