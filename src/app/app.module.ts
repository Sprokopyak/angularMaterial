import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { FirebaseConfig } from '../environments/firebase.config';
import { AngularFirestore } from 'angularfire2/firestore';

import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';
import { CommonsModule } from './commons/commons.module';
import { LoginModule } from './login/login.module';
import { CafeModule } from './cafe/cafe.module';
import { AppRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { Home } from './home/home.component';
import { Admin } from './admin/admin.component';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    Home,
    Admin
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAaWrqJxjZiw7BTzD9wDLybddkb1ktedKQ',
      libraries: ['places']
    }),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutes,
    AngularFireModule.initializeApp(FirebaseConfig.firebase),
    MaterialModule,
    CoreModule,
    LoginModule,
    CommonsModule,
    CafeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
