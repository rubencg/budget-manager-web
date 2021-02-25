import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseComponent, IncomeComponent, TransferComponent } from '../dialogs';

@Component({
  selector: 'transactions-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /* Animations */
  @ViewChild('searchInput') searchInput;
  searchOpen = false;
  searchText: String;

  displaySearch($event) {
    let input = this.searchInput.nativeElement;
    if (this.isHidden(input) && $event.type == 'click') {
      this.searchOpen = !this.searchOpen;
      setTimeout(() => {
        input.focus();
      }, 510);
    } else if ($event.type == 'focusout') {
      if (this.searchText == '' || this.searchText == undefined) {
        this.searchOpen = !this.searchOpen;
      }
    }
  }

  isHidden(el) {
    var style = window.getComputedStyle(el);
    return style.display === 'none';
  }
  /* End of Animations */

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

  createExpenseDialog() {
    const dialogRef = this.dialog.open(ExpenseComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log('Created expense');
      } else {
        console.log('Nothing was created');
      }
    });
  }

  createTransferDialog() {
    const dialogRef = this.dialog.open(TransferComponent, {
      maxWidth: '600px',
      width: 'calc(100% - 64px)',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log('Created transfer');
      } else {
        console.log('Nothing was created');
      }
    });
  }
}
