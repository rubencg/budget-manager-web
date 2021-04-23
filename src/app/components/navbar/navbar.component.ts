import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    this.store.dispatch(new AuthenticationActions.Logout()).subscribe(() => {
      this.router.navigate(['login']);
    });
  }

}
