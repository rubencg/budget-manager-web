import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sp-summary',
  templateUrl: './sp-summary.component.html',
  styleUrls: ['./sp-summary.component.scss']
})
export class SpSummaryComponent implements OnInit {
  panelOpenState = false;

  constructor() { }

  ngOnInit(): void {
  }

}
