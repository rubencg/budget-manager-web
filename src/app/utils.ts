import { Transaction } from './models';
import { PlannedExpense } from './planned-expense';

export const isExpenseInPlannedExpense = (
  plannedExpense: PlannedExpense,
  e: Transaction
): boolean => {
  return (
    e.category.name == plannedExpense.category.name &&
    (plannedExpense.subCategory == null ||
      plannedExpense.subCategory == e.subcategory)
  );
};

export const getCategoryTextForPlannedExpense = (
  plannedExpense: PlannedExpense
): string => {
  let subCategory =
    plannedExpense.subCategory == null ||
    plannedExpense.subCategory == undefined ||
    plannedExpense.subCategory == ''
      ? ''
      : ` - ${plannedExpense.subCategory}`;

  return `${plannedExpense.category.name}${subCategory}`;
};

export const compareTransactionsByDate = (a: Transaction, b: Transaction) => {
  if (a.date > b.date) {
    return -1;
  }
  if (a.date < b.date) {
    return 1;
  }
  return 0;
};
