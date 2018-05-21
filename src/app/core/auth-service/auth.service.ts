import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

import { Observable, pipe } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { of } from 'rxjs';


@Injectable()
export class AuthService {
  user: Observable<User>;
  authState: any = null;
  currentUser: User;
  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public db: AngularFireDatabase,
    private router: Router) {


    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )

    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        firebase.auth().currentUser.getIdToken()
          .then(idToken => {
            return localStorage.setItem('userToken', idToken);
          })
      }
      this.authState = auth
    });
  }

  get isLogedIn(): boolean {
    return this.authState !== null;
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.setUserDoc(user) // create initial user document
      }).then(() => { this.router.navigate(['/home']) })
  }

  // Update properties on the user document
  updateUser(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data)
  }

  // Sets user data to firestore after succesful login
  private setUserDoc(user: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: 'https://goo.gl/Fz9nrQ',
      role: 'user'
    }
    return userRef.set(data, { merge: true })
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/home']);
      })
  }

  resetPassword(email: string) {
    const fbAuth = firebase.auth();
    return fbAuth.sendPasswordResetEmail(email)
  }

  signOut() {
    this.afAuth.auth.signOut()
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => console.log(error));
  }

  googleSignUp() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthSignUp(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => console.log(error));
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => console.log(error));
  }

  facebookSignUp() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthSignUp(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => console.log(error));
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthLogin(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => console.log(error));
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.auth.signInWithPopup(provider)
  }

  private oAuthSignUp(provider: any) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.setUserDoc(credential.user)
      })
  }
}