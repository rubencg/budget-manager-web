import { Injectable } from '@angular/core';
import { State, Action, StateContext, createSelector, Store } from '@ngxs/store';
import { patch, removeItem } from '@ngxs/store/operators';
import { Transaction, TransactionTypes } from 'src/app/models';
import { Transfer, TransferService } from '../../transfer';
import { AccountActions } from '../account';
import { TransferActions } from './transfer.actions';
import { SavingActions } from '../expense/saving-actions';

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
  constructor(private transferService: TransferService,
    private store: Store) {}

  static selectTransactionsForMonth(date: Date) {
    return createSelector([TransferState], (state: TransferStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getMonth() == date.getMonth() &&
          t.date.getFullYear() == date.getFullYear()
      )
    );
  }

  static selectTransactionsForDates(startDate: Date, endDate: Date) {
    return createSelector([TransferState], (state: TransferStateModel) =>
      state.transactions.filter(
        (t: Transaction) =>
          t.date.getFullYear() >= startDate.getFullYear()
          && t.date.getMonth() >= startDate.getMonth()
          && t.date.getDate() >= startDate.getDate()
          && t.date.getFullYear() <= endDate.getFullYear()
          && t.date.getMonth() <= endDate.getMonth()
          && t.date.getDate() <= endDate.getDate()
      )
    );
  }

  @Action(TransferActions.Get)
  getAllTransfers(context: StateContext<TransferStateModel>) {
    this.transferService.getAll(this.store.selectSnapshot((state) => state.authenticationState.user).uid).subscribe((inputTransfers: Transfer[]) => {
      let transfers: Transfer[] = [];
      inputTransfers.forEach((t) => {
        transfers.push({
          amount: t.amount,
          date: new Date(t.date),
          fromAccount: t.fromAccount,
          toAccount: t.toAccount,
          key: t.key,
          savingKey: t.savingKey,
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
          savingKey: t.savingKey,
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

  @Action(TransferActions.DeleteTransfer)
  deleteTransfer(
    ctx: StateContext<TransferStateModel>,
    action: TransferActions.DeleteTransfer
  ) {
    let transaction: Transaction = action.payload;

    // Add amount to fromAccount
    ctx.dispatch(
      new AccountActions.AdjustAccountBalance({
        accountKey: transaction.account.key,
        adjustment: transaction.amount,
      })
    );
    // Substract amount from toAccount
    ctx.dispatch(
      new AccountActions.AdjustAccountBalance({
        accountKey: transaction.transferAccount.key,
        adjustment: transaction.amount * -1,
      })
    );

    // Remove saving if available
    if(transaction.savingKey){
      ctx.dispatch(
        new SavingActions.UpdateSavingAmount({
          key: transaction.savingKey,
          increment: transaction.amount * -1
        })
      )
    }

    // Remove transfer and transaction from state
    this.transferService.delete(this.store.selectSnapshot((state) => state.authenticationState.user).uid, action.payload.key);
    ctx.setState(
      patch({
        transactions: removeItem<Transaction>(
          (t) => t.key == action.payload.key
        ),
        transfers: removeItem<Transfer>((t) => t.key == action.payload.key),
      })
    );
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
      savingKey: (action.payload as unknown as Transfer).savingKey,
      key: action.payload.monthlyKey ? null : action.payload.key,
      notes: action.payload.notes,
    };
    const uid: string = this.store.selectSnapshot((state) => state.authenticationState.user).uid;

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
      // Save to Savings
      if (transfer.savingKey){
        ctx.dispatch(
          new SavingActions.UpdateSavingAmount({
            increment: transfer.amount - oldTransfer.amount,
            key: transfer.savingKey
          })
        )
      }

      this.transferService.update(uid, transfer);
    } else {
      this.transferService.create(uid, transfer);

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

      // Save to Savings if needed
      if (transfer.savingKey){
        ctx.dispatch(
          new SavingActions.UpdateSavingAmount({
            increment: transfer.amount,
            key: transfer.savingKey
          })
        )
      }
    }
  }
}
