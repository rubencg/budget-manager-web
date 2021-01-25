import { AccountType } from "./account-type";

export interface Account{
    description?: String,
    image?: String,
    color?: String,
    currentBalance?: number,
    sumsToMonthlyBudget?: Boolean,
    accountType?: AccountType
}