import { AccountType } from "./";

export interface Account{
    name?: string,
    key?: string,
    image?: string,
    color?: string,
    currentBalance?: number,
    sumsToMonthlyBudget?: Boolean,
    accountType?: AccountType
}