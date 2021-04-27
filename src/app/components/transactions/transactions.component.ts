import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from 'src/app/models';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  date = new Date();
  @ViewChild('transactionsTable') transactionsTable: TableComponent;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  monthDecreased() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    this.transactionsTable.loadTable(this.date);
  }

  monthIncreased() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    this.transactionsTable.loadTable(this.date);
  }

  onTextChanged(value: string) {
    this.transactionsTable.applyFilter(value);
  }

  onFilter(filter: Filter) {
    if (filter.clearFilters) {
      this.router
        .navigate(['/transactions'])
        .then(() => this.transactionsTable.loadTable(this.date));
    } else {
      this.router
        .navigate(['/transactions'], {
          queryParams: {
            startDate: filter.startDate,
            endDate: filter.endDate,
            categories: filter.categories
              ? filter.categories.join(',')
              : undefined,
            accounts: filter.accounts ? filter.accounts.join(',') : undefined,
            types: filter.types ? filter.types.join(',') : undefined,
          },
        })
        .then(() => this.transactionsTable.loadTable(this.date));
    }
  }
}
