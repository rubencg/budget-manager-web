import { AccountType } from "./";

export interface Account{
    description?: String,
    image?: String,
    color?: String,
    currentBalance?: number,
    sumsToMonthlyBudget?: Boolean,
    accountType?: AccountType
}