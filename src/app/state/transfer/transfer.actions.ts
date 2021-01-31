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
}