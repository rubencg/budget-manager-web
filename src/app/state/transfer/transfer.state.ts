import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Account } from 'src/app/account';
import { Transfer, TransferService } from '../../transfer';
import { AccountActions } from '../account';
import { TransferActions } from './transfer.actions';

export interface TransferStateModel {
  transfers: Transfer[];
}

@State<TransferStateModel>({
  name: 'transferState',
  defaults: {
    transfers: [],
  },
})
@Injectable()
export class TransferState {
  constructor(private transferService: TransferService) {}

  @Selector()
  static selectTransfers(state: TransferStateModel) {
    return state.transfers;
  }

  @Action(TransferActions.Get)
  getAllTransfers(context: StateContext<TransferStateModel>) {
    this.transferService
      .getAll()
      .pipe(
        map((apiTransfers) => {
          let data: Transfer[] = [];

          apiTransfers.forEach((apiTransfer: any) => {
            data.push({
              amount: apiTransfer.amount,
              date: new Date(+apiTransfer.date),
              fromAccount: {
                image: apiTransfer.fromAccount.img,
                name: apiTransfer.fromAccount.name,
              },
              toAccount: {
                image: apiTransfer.toAccount.img,
                name: apiTransfer.toAccount.name,
              },
            });
          });

          return data;
        })
      )
      .subscribe((transfers: Transfer[]) =>
        context.dispatch(new TransferActions.GetSuccess(transfers))
      );
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
      sumsToMonthlyBudget: transfer.fromAccount.sumsToMonthlyBudget
    };
    ctx.dispatch(new AccountActions.SaveAccount(fromAccount));
    
    let toAccount: Account = {
      accountType: transfer.toAccount.accountType,
      color: transfer.toAccount.color,
      currentBalance: transfer.toAccount.currentBalance + transfer.amount,
      name: transfer.toAccount.name,
      image: transfer.toAccount.image,
      key: transfer.toAccount.key,
      sumsToMonthlyBudget: transfer.toAccount.sumsToMonthlyBudget
    };
    ctx.dispatch(new AccountActions.SaveAccount(toAccount));

  }
}
