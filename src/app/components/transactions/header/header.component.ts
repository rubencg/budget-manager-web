import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseComponent, IncomeComponent, TransferComponent } from '../dialogs';

@Component({
  selector: 'transactions-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  createIncomeDialog(){
    const dialogRef = this.dialog.open(IncomeComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)'      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        console.log('Created income');
      }else{
        console.log('Nothing was created');
      }
    });
  }
  
  createExpenseDialog(){
    const dialogRef = this.dialog.open(ExpenseComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)'      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        console.log('Created expense');
      }else{
        console.log('Nothing was created');
      }
    });
  }

  createTransferDialog(){
    const dialogRef = this.dialog.open(TransferComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)'      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        console.log('Created transfer');
      }else{
        console.log('Nothing was created');
      }
    });
  }

}
