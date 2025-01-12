import { Category } from "../category";

export interface PlannedExpense {
    name: string,
    date: Date,
    isRecurring: boolean,
    totalAmount: number,
    category: Category,
    subCategory?: string,
    key?: string,
}