import { Injectable } from '@angular/core';
import { State, Action, StateContext, createSelector } from '@ngxs/store';
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
  transfersLoaded(
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
  transactionsLoaded(
    ctx: StateContext<TransferStateModel>,
    action: TransferActions.GetTransactionsSuccess
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      transactions: action.payload,
    });
  }

  @Action(TransferActions.SaveTransferTransaction)
  saveTransfer(
    ctx: StateContext<TransferStateModel>,
    action: TransferActions.SaveTransferTransaction
  ) {
    let transfer: Transfer = {
      amount: action.payload.amount,
      date: action.payload.date,
      fromAccount: action.payload.account,
      toAccount: action.payload.transferAccount,
      key: action.payload.monthlyKey ? null : action.payload.key,
      notes: action.payload.notes,
    };

    if (transfer.key) {
      const oldTransfer: Transfer = ctx
        .getState()
        .transfers.find((i) => i.key == action.payload.key);

      // Adjust old from Account
      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: oldTransfer.fromAccount.key,
          adjustment: oldTransfer.amount,
        })
      );
      // Adjust new from Account
      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: transfer.fromAccount.key,
          adjustment: transfer.amount * -1,
        })
      );
      // Adjust old to account
      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: oldTransfer.toAccount.key,
          adjustment: oldTransfer.amount * -1,
        })
      );
      // Adjust new to Account
      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: transfer.toAccount.key,
          adjustment: transfer.amount,
        })
      );

      this.transferService.update(transfer);
      
    } else {
      this.transferService.createNewTransfer(transfer);

      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: transfer.fromAccount.key,
          adjustment: transfer.amount * -1,
        })
      );

      ctx.dispatch(
        new AccountActions.AdjustAccountBalance({
          accountKey: transfer.toAccount.key,
          adjustment: transfer.amount,
        })
      );
    }
  }
}
