import { Account } from "../account";
import { Category } from "../category";

export interface Transaction {
  type: String;
  title?: String;
  amount: number;
  date: Date;
  category?: Category;
  account?: Account;
  transferAccount?: Account;
  notes?: String;
  applied?: Boolean;
}
