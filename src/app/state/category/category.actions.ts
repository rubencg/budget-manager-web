import { Category } from '../../category';

export namespace CategoryActions{
  export class GetIncomeCategories {
    static readonly type = '[Dashboard] GetIncomeCategories';
    constructor() {}
  }

  export class GetIncomeCategorySuccess {
    static readonly type = '[Firebase] IncomeCategoriesLoaded';
    constructor(public payload: Category[]) {}
  }

  export class GetExpenseCategories {
    static readonly type = '[Dashboard] GetExpenseCategories';
    constructor() {}
  }

  export class GetExpenseCategorySuccess {
    static readonly type = '[Firebase] ExpenseCategoriesLoaded';
    constructor(public payload: Category[]) {}
  }
}