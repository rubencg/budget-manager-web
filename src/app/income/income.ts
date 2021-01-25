import { Category } from "../category/category";

interface Income{
    amount: number,
    date: Date,
    isApplied: Boolean,
    notes: String,
    toAccount: Account,
    category: Category,
    subCategory?: String
}