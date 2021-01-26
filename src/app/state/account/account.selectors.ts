import { Injectable } from "@angular/core";
import { Selector, State } from "@ngxs/store";
import { AccountStateModel } from "./";

@State<AccountStateModel>({
    name: 'accountState'
  })
@Injectable()
export class AccountSelectors {
  @Selector()
  static selectAccounts(state: AccountStateModel) {
    return state.accounts;
  }
}
