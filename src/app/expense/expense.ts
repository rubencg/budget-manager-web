import { Category } from '../category';
import { Account } from '../account'

export interface Expense{
    amount: number,
    date: Date,
    isApplied?: Boolean,
    notes?: String,
    key?: string,
    fromAccount: Account,
    category: Category,
    subCategory?: string
}