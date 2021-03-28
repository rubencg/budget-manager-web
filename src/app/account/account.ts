import { AccountType } from "./";

export interface Account{
    name?: String,
    key?: string,
    image?: String,
    color?: String,
    currentBalance?: number,
    sumsToMonthlyBudget?: Boolean,
    accountType?: AccountType
}