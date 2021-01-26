import { Category } from "../category";
import { Account } from '../account';

export interface Income{
    amount: number,
    date?: Date,
    isApplied?: Boolean,
    notes?: String,
    toAccount?: Account,
    category?: Category,
    subCategory?: String
}