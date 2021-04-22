import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthenticationActions } from 'src/app/state';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    'navbar.style.scss'
  ]
})
export class NavbarComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  logout(){
    this.store.dispatch(new AuthenticationActions.Logout());
  }

}
