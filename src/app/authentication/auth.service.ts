import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(public afAuth: AngularFireAuth) { }

  // Sign in with email/password
  signIn(email, password) {
    return this.afAuth.setPersistence('local').then(_ => {
      return this.afAuth.signInWithEmailAndPassword(email, password);
    });
  }
  // Sign out
  signOut() {
    return this.afAuth.signOut();
  }
}
