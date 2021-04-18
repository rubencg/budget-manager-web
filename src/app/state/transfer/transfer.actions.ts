import { Transaction } from 'src/app/models';
import { Transfer } from '../../transfer/';

export namespace TransferActions{
  export class Get {
    static readonly type = '[Dashboard] GetTransfers';
    constructor() {}
  }

  export class GetSuccess {
    static readonly type = '[Firebase] TransfersLoaded';
    constructor(public payload: Transfer[]) {}
  }
  
  export class GetTransactionsSuccess {
    static readonly type = '[Firebase] TransferTransactionsLoaded';
    constructor(public payload: Transaction[]) {}
  }
  
  export class SaveTransferTransaction {
    static readonly type = '[Transfer] SaveTransferTransaction';
    constructor(public payload: Transaction) {}
  }
}