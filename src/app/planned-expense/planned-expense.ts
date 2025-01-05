import { Category } from "../category";

export interface PlannedExpense {
    name: string,
    totalAmount: number,
    category: Category,
    subCategory?: string,
    remainingAmount?: number,
    key?: string,
}