import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { Account } from 'src/app/account';
import { Transaction, TransactionTypes } from 'src/app/models';
import { Transfer, TransferService } from '../../transfer';
import { AccountActions } from '../account';
import { TransferActions } from './transfer.actions';

export interface TransferStateModel {
  transfers: Transfer[];
  transactions: Transaction[];
}

@State<TransferStateModel>({
  name: 'transferState',
  defaults: {
    transfers: [],
    transactions: [],
  },
})
@Injectable()
export class TransferState {
  constructor(private transferService: TransferService) {}

  static selectTransactionsForMonth(date: Date) {
    return createSelector([TransferState], (state: TransferStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  @Action(TransferActions.Get)
  getAllTransfers(context: StateContext<TransferStateModel>) {
    this.transferService.getAll().subscribe((inputTransfers: Transfer[]) => {
      let transfers: Transfer[] = [];
      inputTransfers.forEach((t) => {
        transfers.push({
          amount: t.amount,
          date: new Date(t.date),
          fromAccount: t.fromAccount,
          toAccount: t.toAccount,
          key: t.key,
          notes: t.notes,
        });
      });
      context.dispatch(new TransferActions.GetSuccess(transfers));
      let transactions: Transaction[] = [];
      transfers.forEach((t) => {
        transactions.push({
          amount: t.amount,
          date: new Date(t.date),
          account: t.fromAccount,
          transferAccount: t.toAccount,
          key: t.key,
          notes: t.notes,
          type: TransactionTypes.Transfer,
        });
      });
      context.dispatch(
        new TransferActions.GetTransactionsSuccess(transactions)
      );
    });
  }

  @Action(TransferActions.GetSuccess)
  TransfersLoaded(
    ctx: StateContext<TransferStateModel>,
    action: TransferActions.GetSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      transfers: action.payload,
    });
  }

  @Action(TransferActions.GetTransactionsSuccess)
  TransactionsLoaded(
    ctx: StateContext<TransferStateModel>,
    action: TransferActions.GetTransactionsSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      transactions: action.payload,
    });
  }

  @Action(TransferActions.SaveTransfer)
  saveTransfer(
    ctx: StateContext<TransferStateModel>,
    action: TransferActions.SaveTransfer
  ) {
    let transfer: Transfer = action.payload;
    this.transferService.createNewTransfer(transfer);

    let fromAccount: Account = {
      accountType: transfer.fromAccount.accountType,
      color: transfer.fromAccount.color,
      currentBalance: transfer.fromAccount.currentBalance - transfer.amount,
      name: transfer.fromAccount.name,
      image: transfer.fromAccount.image,
      key: transfer.fromAccount.key,
      sumsToMonthlyBudget: transfer.fromAccount.sumsToMonthlyBudget,
    };
    ctx.dispatch(new AccountActions.SaveAccount(fromAccount));

    let toAccount: Account = {
      accountType: transfer.toAccount.accountType,
      color: transfer.toAccount.color,
      currentBalance: transfer.toAccount.currentBalance + transfer.amount,
      name: transfer.toAccount.name,
      image: transfer.toAccount.image,
      key: transfer.toAccount.key,
      sumsToMonthlyBudget: transfer.toAccount.sumsToMonthlyBudget,
    };
    ctx.dispatch(new AccountActions.SaveAccount(toAccount));
  }
}
