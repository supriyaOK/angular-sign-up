import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser$ = authState(this.auth as any);
  constructor(private auth: Auth) {}

  //change type 'string' to 'any' boz given error in login component 'Argument of type 'string | null | undefined' is not assignable to parameter of type 'string'.
  //Type 'undefined' is not assignable to type 'string'

  login(username: any, password: any) {
    //signInWithEmailAndPassword() function provided by firebase and this function returns promise.
    //But we need return an observable because we using the same in project so we add from()
    //from Rxjs to convert it.
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  signUp(name: any, email: any, password: any) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(switchMap(({ user }) => updateProfile(user, { displayName: name })));
  }

  logout() {
    return from(this.auth.signOut());
  }
}
