import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { FirebaseConfig } from '../environments/firebase.config';
import { AngularFirestore } from 'angularfire2/firestore';

import { MaterialModule } from './material/material.module';
import { AppRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { Home } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    Home
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutes,
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
