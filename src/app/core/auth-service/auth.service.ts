import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

import { Observable, pipe, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { of } from 'rxjs';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Injectable()
export class AuthService {
  user: Observable<User>;
  authState: any = null;
  currentUser= new Subject<User>() ;
  constructor(public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public db: AngularFireDatabase,
    private router: Router,
    private dialog: MatDialog) {


    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.currentUser.next({
            uid: user.uid,
            email: user.email,
            role: 'user'
          })
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

  showMessageDialog(message: string): void {
    this.dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  get isLogedIn(): boolean {
    return this.authState !== null;
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.setUserDoc(user)
      }).then(() => { this.router.navigate(['/home']) })
  }

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
      .catch((error) => {
        this.showMessageDialog('Ви ввели невірний емейл або пароль')
      })
  }

  resetPassword(email: string) {
    const fbAuth = firebase.auth();
    return fbAuth.sendPasswordResetEmail(email)
      .then(() => this.showMessageDialog('Детеалі з відновленням паролю були відправлені на ваш емайл: ' + email))
      .catch(error => this.showMessageDialog(error.message));
  }

  signOut() {
    this.afAuth.auth.signOut()
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => this.showMessageDialog(error.message));
  }

  googleSignUp() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthSignUp(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => this.showMessageDialog(error.message));
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => this.showMessageDialog(error.message));
  }

  facebookSignUp() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthSignUp(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => this.showMessageDialog(error.message));
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthLogin(provider)
      .then(() => { this.router.navigate(['/home']) })
      .catch(error => this.showMessageDialog(error.message));
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