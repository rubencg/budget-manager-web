import { Transaction } from "./models";
import { PlannedExpense } from "./planned-expense";

export const isExpenseInPlannedExpense = (plannedExpense: PlannedExpense, e: Transaction): boolean => {
  return e.category.name == plannedExpense.category.name &&
        (plannedExpense.subCategory == null ||
          plannedExpense.subCategory == e.subcategory)
}