import { Component, OnInit } from '@angular/core';
import { faSearch, faPlus, faFilter, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'transactions-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchIcon = faSearch;
  addIcon = faPlus;
  filterIcon = faFilter;
  leftArrowIcon = faChevronRight;
  rightArrowIcon = faChevronLeft;

  constructor() { }

  ngOnInit(): void {
  }

}
