import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Saving } from './saving';

@Injectable()
export class SavingService {

  entityName: string = 'saving';

  constructor(private db: AngularFireDatabase) {
  }

  getAll(uid: string) {
    return this.db
      .list(`${uid}/${this.entityName}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.val() as Saving;
            const key = a.payload.key;
            return { key, ...data };
          });
        })
      );
  }

  update(uid: string, saving: Saving): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).update(saving.key, {
      name: saving.name,
      icon: saving.icon,
      goalAmount: saving.goalAmount,
      savedAmound: saving.savedAmound
    });
  }

  create(uid: string, saving: Saving) {
    return this.db.list(`${uid}/${this.entityName}`).push({
      name: saving.name,
      icon: saving.icon,
      goalAmount: saving.goalAmount,
      savedAmound: saving.savedAmound
    });
  }

  delete(uid: string, key: string): Promise<void> {
    return this.db.list(`${uid}/${this.entityName}`).remove(key);
  }
  
}
