import { Account } from "../account";
import { Category } from "../category";
import { RecurringTypes } from "./recurring-types";
import { TransactionTypes } from "./transaction-types";

export interface Transaction {
  type: TransactionTypes;
  title?: String;
  key?: string;
  subcategory?: string;
  amount: number;
  appliedAmount?: number;
  date: Date;
  category?: Category;
  account?: Account;
  transferAccount?: Account;
  notes?: String;
  applied?: Boolean;
  isMonthly?: Boolean;
  isRecurring?: Boolean;
  monthlyKey?: string;
  recurringTimes?: number;
  recurringType?: RecurringTypes;
  removeFromSpendingPlan?: Boolean;
}
