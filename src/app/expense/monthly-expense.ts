import { Category } from "../category";
import { Account } from '../account';

export interface MonthlyExpense {
    amount: number,
    day?: number,
    key?: string,
    notes?: String,
    fromAccount?: Account,
    category?: Category,
    subCategory?: string
}