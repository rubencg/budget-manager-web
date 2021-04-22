import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthenticationState } from "../state/authentication/authentication.state";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate() {
    const isAuthenticated = this.store.selectSnapshot(AuthenticationState.isAuthenticated);
    
    return isAuthenticated;
  }
}