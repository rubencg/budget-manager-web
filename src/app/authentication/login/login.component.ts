import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthenticationActions } from 'src/app/state/authentication/authentication.actions';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hidePassword = true;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  logIn(){
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    this.store.dispatch(new AuthenticationActions.Login({
      username: email,
      password: password
    }));
  }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

}
