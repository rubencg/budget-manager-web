import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { Transfer, TransferService } from '../../transfer';
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
                description: apiTransfer.fromAccount.name,
              },
              toAccount: {
                image: apiTransfer.toAccount.img,
                description: apiTransfer.toAccount.name,
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
}
