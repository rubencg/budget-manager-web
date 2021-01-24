interface Expense{
    amount: number,
    date: Date,
    fromAccount: Account,
    category: Category,
    subCategory?: String
}