export interface Saving {
  name: string;
  icon: string;
  goalAmount: number;
  amountPerMonth: number;
  savedAmount?: number;
  isApplied?: boolean;
  color: string;
  key?: string;
}

export interface SavingAmount {
    key: string;
    increment: number;
}
