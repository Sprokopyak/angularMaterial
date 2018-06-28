import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Injectable()
export class AuthService {
  user: Observable<User>;
  authState: any = null;
  constructor(private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _router: Router,
    private _dialog: MatDialog) {

    this.user = this._afAuth.authState.pipe(
      switchMap(user => {
        this.authState = user
        if (user) {
          return this._afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null)
        }
      })
    )   
  }

  showMessageDialog(message: string): void {
    this._dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  get isLogedIn(): boolean {
    return this.authState !== null;
  }

  emailSignUp(email: string, password: string) {
    return this._afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.setUserDoc(user.user)
      }).then(() => { this._router.navigate(['/home']) })
  }

  private setUserDoc(user: any) {
    const userRef: AngularFirestoreDocument<User> = this._afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      reserved: {
        cafeId: '',
        approvedBoking: false,
        reservedTime: '',
        reservationValidTill: '',
        visitorsNumber: ''
      },
      role: 'user',
      selectedCafes: []
    }
    return userRef.set(data, { merge: true });
  }

  emailLogin(email: string, password: string) {
    return this._afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => this._router.navigate(['/home']))
      .catch(() => this.showMessageDialog('Ви ввели невірний емейл або пароль'));
  }

  resetPassword(email: string) {
    const fbAuth = firebase.auth();
    return fbAuth.sendPasswordResetEmail(email)
      .then(() => this.showMessageDialog('Детеалі з відновленням паролю були відправлені на ваш емайл: ' + email))
      .catch(error => this.showMessageDialog(error.message));
  }

  signOut() {
    this._afAuth.auth.signOut()
      .then(() => this._router.navigate(['/home']))
      .catch(error => this.showMessageDialog(error.message));
  }

  googleSignUp() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthSignUp(provider)
      .then(() => this._router.navigate(['/home']))
      .catch(error => this.showMessageDialog(error.message));
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then(() => this._router.navigate(['/home']))
      .catch(error => this.showMessageDialog(error.message));
  }

  facebookSignUp() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthSignUp(provider)
      .then(() => this._router.navigate(['/home']))
      .catch(error => this.showMessageDialog(error.message));
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.oAuthLogin(provider)
      .then(() => this._router.navigate(['/home']))
      .catch(error => this.showMessageDialog(error.message));
  }

  private oAuthLogin(provider: any) {
    return this._afAuth.auth.signInWithPopup(provider)
  }

  private oAuthSignUp(provider: any) {
    return this._afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.setUserDoc(credential.user)
      })
  }
}