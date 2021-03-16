import { Account } from "../account";

export interface AccountGroup{
    name: String;
    balance: number;
    accounts: Account[];
}