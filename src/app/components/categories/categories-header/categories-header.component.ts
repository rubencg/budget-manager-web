import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'categories-header',
  templateUrl: './categories-header.component.html',
  styleUrls: ['./categories-header.component.scss']
})
export class CategoriesHeaderComponent implements OnInit {
  @Input() title: String;
  @Input() categoriesType: String;

  constructor() { }

  ngOnInit(): void {
  }

}
