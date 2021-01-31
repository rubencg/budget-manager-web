import { Category } from '../../category';

export namespace CategoryActions{
  export class GetIncomeCategories {
    static readonly type = '[Dashboard] GetIncomeCategories';
    constructor() {}
  }

  export class GetIncomeCategorySuccess {
    static readonly type = '[Firebase] CategorysLoaded';
    constructor(public payload: Category[]) {}
  }
}