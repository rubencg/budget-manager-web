import { Category } from "../category";
import { Account } from '../account';

export interface MonthlyIncome{
    amount: number,
    day?: number,
    key?: string,
    notes?: String,
    toAccount?: Account,
    category?: Category,
    subCategory?: string
}