import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(public afAuth: AngularFireAuth) {}

  // Sign in with email/password
  signIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  // Sign out
  signOut() {
    return this.afAuth.signOut();
  }
}
