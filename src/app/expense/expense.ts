import { Category } from '../category';
import { Account } from '../account'

export interface Expense{
    amount: number,
    date: Date,
    notes: String,
    fromAccount: Account,
    category: Category,
    subCategory?: String
}