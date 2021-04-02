import { Category } from '../../category';

export namespace CategoryActions{
  /* Income Categories */
  export class GetIncomeCategories {
    static readonly type = '[Dashboard] GetIncomeCategories';
    constructor() {}
  }
  
  export class GetIncomeCategorySuccess {
    static readonly type = '[Firebase] IncomeCategoriesLoaded';
    constructor(public payload: Category[]) {}
  }

  export class SaveIncomeCategory {
    static readonly type = '[Income Categories Page] SaveIncomeCategory';
    constructor(public payload: Category) {}
  }

  export class DeleteIncomeCategory {
    static readonly type = '[Income Categories Page] DeleteIncomeCategory';
    constructor(public payload: Category) {}
  }
  /* Ends Income Categories */
  
  /* Ends Expense Categories */
  export class GetExpenseCategories {
    static readonly type = '[Dashboard] GetExpenseCategories';
    constructor() {}
  }
  
  export class GetExpenseCategorySuccess {
    static readonly type = '[Firebase] ExpenseCategoriesLoaded';
    constructor(public payload: Category[]) {}
  }

  export class SaveExpenseCategory {
    static readonly type = '[Expense Categories Page] SaveExpenseCategory';
    constructor(public payload: Category) {}
  }

  export class DeleteExpenseCategory {
    static readonly type = '[Expense Categories Page] DeleteExpenseCategory';
    constructor(public payload: Category) {}
  }
  /* Ends Expense Categories */
}