import { Account } from "../account";

export interface Transfer{
    amount: number,
    date: Date,
    fromAccount: Account,
    toAccount: Account
}