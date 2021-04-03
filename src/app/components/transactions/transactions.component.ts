import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  date = new Date();
  @ViewChild('transactionsTable') transactionsTable: TableComponent;

  constructor() { }

  ngOnInit(): void {
  }

  monthDecreased(){
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    this.transactionsTable.loadTable(this.date);
  }
  
  monthIncreased(){
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    this.transactionsTable.loadTable(this.date);
  }

}
