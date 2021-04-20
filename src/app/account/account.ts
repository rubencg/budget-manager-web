import { AccountType } from "./";

export interface Account{
    name?: String,
    key?: string,
    image?: string,
    color?: string,
    currentBalance?: number,
    sumsToMonthlyBudget?: Boolean,
    accountType?: AccountType
}