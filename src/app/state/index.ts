import { AccountState } from './account';
import { IncomeState } from './income';

export * from './account';
export * from './income';

export const budgetManagerState = [
  AccountState,
  IncomeState
];
