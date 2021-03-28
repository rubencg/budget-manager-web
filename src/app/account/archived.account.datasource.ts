import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from "rxjs";
import { AccountStateModel } from "../state";
import { Account } from "./account";

export class ArchivedAccountDataSource extends MatTableDataSource<Account> {
  private transactions: Account[] = [];

  private transactions$: Subscription;

  constructor(transactions: Observable<AccountStateModel>) {
    super();
    this.transactions$ = transactions.subscribe(transactionList => {
      this.transactions = transactionList.accounts;
      this.data = this.transactions;
    });
  }

  disconnect() {
    this.transactions$.unsubscribe();
    super.disconnect();
  }
}
