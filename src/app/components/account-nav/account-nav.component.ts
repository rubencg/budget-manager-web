import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DashboardAccount, Account } from 'src/app/account';
import { AccountState } from 'src/app/state';

@Component({
  selector: 'account-nav',
  templateUrl: 'account-nav.html',
  styleUrls: ['account-nav.style.scss'],
})
export class AccountNavComponent implements OnInit {
  cards = [];

  @Select(AccountState.selectDashboardAccounts) dashboardAccounts$: Observable<
    DashboardAccount[]
  >;
  accounts$: Observable<Account[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.dashboardAccounts$.subscribe(
      (dashboardAccounts: DashboardAccount[]) => {
        
        this.accounts$ = this.store.select(
          AccountState.selectAccountsFromDashboardAccounts(dashboardAccounts)
          );
          
          this.accounts$.subscribe((accounts: Account[]) => {
          if (dashboardAccounts && dashboardAccounts.length > 0) {
            this.cards = [];

            dashboardAccounts.forEach((dashboardAccount: DashboardAccount) => {
              if (accounts && accounts.length > 0) {
                const account: Account = accounts.find(
                  (a) => a.key == dashboardAccount.accountKey
                );

                if (account) {
                  this.cards.push({
                    accountName: account.name,
                    accountBalance: account.currentBalance,
                    cardLastFour: dashboardAccount.lastFour,
                    color: dashboardAccount.color,
                  });
                }
              }
            });
          }
        });
      }
    );
  }
}
