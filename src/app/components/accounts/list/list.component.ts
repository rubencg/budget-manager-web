import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Account } from 'src/app/account';
import { AccountGroup } from 'src/app/models';
import { AccountDialogComponent, ArchiveAccountComponent } from '../dialogs';

@Component({
  selector: 'accounts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  editAccount(account: Account){
    const accountDialogRef = this.dialog.open(AccountDialogComponent, {
      data: account,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      autoFocus: false
    });
    accountDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Edit account', result);
      } else {
        console.log('Dont edit account');
      }
    });
  }

  archiveAccount(account: Account){
    const archiveAccountDialogRef = this.dialog.open(ArchiveAccountComponent, {
      data: account,
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
      autoFocus: false
    });
    archiveAccountDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Archive account', result);
      } else {
        console.log('Dont archive account');
      }
    });
  }
  
  accounts: Account[] = [
    {
      color: '#32a852',
      sumsToMonthlyBudget: false,
      currentBalance: +(Math.random()*1548).toFixed(2),
      image: 'money-bill',
      description: 'Ruben Efectivo',
      accountType: {
        name: 'Efectivo'
      }
    },
    {
      color: '#f5e042',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*158).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Efectivo',
      accountType: {
        name: 'Efectivo'
      }
    },
    {
      color: '#e036e3',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*-1548).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Debito',
      accountType: {
        name: 'Debito'
      }
    }
  ];

  accountGroups: AccountGroup[] = [
    {
      accounts: this.accounts,
      balance: this.accounts.reduce((prev, curr) => prev + curr.currentBalance, 0),
      name: 'Efectivo'
    },
    {
      accounts: this.accounts,
      balance: this.accounts.reduce((prev, curr) => prev + curr.currentBalance, 0),
      name: 'Debito'
    },
    {
      accounts: this.accounts,
      balance: this.accounts.reduce((prev, curr) => prev + curr.currentBalance, 0),
      name: 'Ahorros Ruben'
    },
  ];
  
}
