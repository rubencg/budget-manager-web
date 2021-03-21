import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Account } from 'src/app/account';

@Component({
  selector: 'archived-table',
  templateUrl: './archived-table.component.html',
  styleUrls: ['./archived-table.component.scss']
})
export class ArchivedTableComponent implements OnInit {
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
      color: '#32a852',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*158).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Efectivo',
      accountType: {
        name: 'Efectivo'
      }
    },
    {
      color: '#32a852',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*-1548).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Debito',
      accountType: {
        name: 'Debito'
      }
    },
    {
      color: '#32a852',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*-1548).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Debito',
      accountType: {
        name: 'Debito'
      }
    },
    {
      color: '#32a852',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*-1548).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Debito',
      accountType: {
        name: 'Debito'
      }
    },
    {
      color: '#32a852',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*-1548).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Debito',
      accountType: {
        name: 'Debito'
      }
    },
    {
      color: '#32a852',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*-1548).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Debito',
      accountType: {
        name: 'Debito'
      }
    },
    {
      color: '#32a852',
      sumsToMonthlyBudget: true,
      currentBalance: +(Math.random()*-1548).toFixed(2),
      image: 'money-check-alt',
      description: 'Sarahi Debito',
      accountType: {
        name: 'Debito'
      }
    }
  ];
  displayedColumns: string[] = [
    'name',
    'type',
    'balance',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Account>(this.accounts);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
