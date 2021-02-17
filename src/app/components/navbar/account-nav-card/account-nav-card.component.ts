import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'account-nav-card',
  templateUrl: './account-nav-card.component.html',
  styleUrls: ['./account-nav-card.component.scss']
})
export class AccountNavCardComponent implements OnInit {
  @Input() accountName: string;
  @Input() accountBalance: number;
  @Input() cardLastFour: string;
  @Input() color: string;

  constructor() { }

  ngOnInit(): void {
  }

}
