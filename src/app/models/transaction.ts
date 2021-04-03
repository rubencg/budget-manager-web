import { Account } from "../account";
import { Category } from "../category";
import { TransactionTypes } from "./transaction-types";

export interface Transaction {
  type: TransactionTypes;
  title?: String;
  key?: String;
  amount: number;
  date: Date;
  category?: Category;
  account?: Account;
  transferAccount?: Account;
  notes?: String;
  applied?: Boolean;
}
