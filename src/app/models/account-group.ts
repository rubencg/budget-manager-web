import { Account, AccountType } from "../account";

export interface AccountGroup{
    accountType: AccountType;
    balance?: number;
    accounts: Account[];
}