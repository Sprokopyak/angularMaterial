import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

import { AuthService } from './auth-service/auth.service';
import { AdminGuard } from './admin-guard/admin.guard';
import { LoginGuard } from './login-guard/login.guard';

@NgModule({
  imports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [AdminGuard, LoginGuard, AuthService, AngularFireDatabase]
})

export class CoreModule { }